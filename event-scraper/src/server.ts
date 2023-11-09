import { logger } from "./utils/logger";
import Cache from "file-system-cache";
import { InstagramPost, InstagramService } from "./services/instagram.service";
import { ChatGptService } from "./services/chatgpt.service";
import {
  MusicEventModel,
  NewMusicEvent,
  NewMusicEventWithArtistNames,
} from "./database/models/music-event";
import { SavedVenue, VenueModel } from "./database/models/venue";
import { SpotifyService } from "./services/spotify.service";
import {
  MusicArtistModel,
  NewMusicArtist,
  SavedMusicArtist,
} from "./database/models/music-artist";
import { DatabaseManager } from "./database/db-manager";
import { ErrorUtils } from "./utils/error";
import { ExternalScraperService } from "./services/external-scraper.service";

export class Server {
  // should prob not be adding static state here lol but since it's a scraper and it just runs once it's prob fine
  private static totalDbStats = {
    savedEventArtistPairCount: 0,
    savedEvents: [] as string[],
    savedArtists: [] as string[],
  };

  // this job should run around 5am KST everyday
  public static async run() {
    logger.info("Running scraper...");

    const venues = await VenueModel.getAllScrapable();
    logger.info("Retrieved venues from DB", { count: venues.length });

    for (const venue of venues) {
      logger.info("Processing venue", {
        name: venue.name,
        instagramId: venue.instagramUsername,
        country: venue.country,
        city: venue.city,
      });

      try {
        // get instagram posts
        const posts = await InstagramService.fetchUserPosts(
          venue.instagramUsername
        );

        if (!posts) {
          // TODO for these types of logs where it should prompt me to take some kind of action, maybe i should log it somewhere special..
          logger.warn("Tried fetching posts but username doesn't exist, skip");
          continue;
        }

        // parse events from posts
        const events = await this.parseEventsFromVenuePosts(venue, posts);
        logger.info("Extracted events from posts", { count: events.length });

        // save data models to DB
        logger.info("Saving models to DB");
        await this.saveEventModels(events);
      } catch (error: any) {
        logger.error("Venue processing failed, move on to next venue", {
          instagramId: venue.instagramUsername,
          error: ErrorUtils.toObject(error),
        });
      }
    }

    logger.info("Finished processing all venues", {
      venues: venues.map((v) => v.instagramUsername),
      totalDbStats: this.totalDbStats,
      totalChatGptUsageStats: ChatGptService.totalUsageStats,
      totalExternalScraperUsage: ExternalScraperService.totalUsageStats,
    });
  }

  // INVARIANT: posts are ordered from newest to oldest
  private static async parseEventsFromVenuePosts(
    venue: SavedVenue,
    posts: InstagramPost[]
  ): Promise<NewMusicEventWithArtistNames[]> {
    const events: NewMusicEventWithArtistNames[] = [];
    for (const post of posts) {
      try {
        logger.info("Processing post", {
          instagramUsername: post.username,
          link: post.link,
          postTextSnippet: post.text?.slice(0, 50),
        });

        if (post.text === undefined || post.text.length === 0) {
          logger.warn("Post doesn't have any text, don't add to result", {
            link: post.link,
          });
          continue;
        }

        // This won't cover the case for events that are advertised multiple times,
        // but the event shouldn't persist regardless since the db has a unique constraint on (venue_id, start_date_time).
        // If we really wanted to we could do another existence check after parsing, since we'll have access to start_date_time.
        const savedMusicEvent = await MusicEventModel.getOneByLink(post.link);
        if (savedMusicEvent) {
          // TODO actually we can do better given that invalid music events aren't persisted to db and can still be parsed
          //      however the cache will still be hit, and redundant api requests aren't made so maybe it's fine
          //      maybe consider persisting invalid music events...
          logger.warn("Music event already exists in DB. don't add to result", {
            link: post.link,
          });
          continue;
        }

        const parsedEvent = await ChatGptService.parseInstagramEvent(post);
        logger.info("Parsed event from post", {
          instagramUsername: post.username,
          link: post.link,
          parsedEvent,
        });

        if (!MusicEventModel.isValid(parsedEvent)) {
          logger.warn(
            "Post was parsed, but a valid event couldn't be extracted. don't add to result",
            { link: post.link }
          );
          continue;
        }

        const event = MusicEventModel.toNew(parsedEvent, post, venue);
        events.push(event);
      } catch (error: any) {
        logger.error("Event parsing failed for post", {
          postLink: post.link,
          postTextSnippet: post.text?.slice(0, 50),
          error: ErrorUtils.toObject(error),
        });
      }
    }

    return events;
  }

  // INVARIANT: assume all events have at least 1 artist
  private static async saveEventModels(events: NewMusicEventWithArtistNames[]) {
    const dbStats = {
      savedEventCount: 0,
      savedArtistCount: 0,
      savedEventArtistPairCount: 0,
    };

    // for each event:
    // - save artists to DB (+ attach saved ids to event)
    // - save music event to DB
    // - save artist-music_event to DB
    for (const event of events) {
      logger.info("Saving event and related models to DB", {
        link: event.link,
        artistNames: event.artistNames,
      });

      const artistIdsForEvent: string[] = [];
      const newArtists: NewMusicArtist[] = [];

      // create new artist DTOs from artist names
      for (const artistName of event.artistNames) {
        // check if artist already exists in DB before searching online
        const savedArtist = await MusicArtistModel.getOneByName(artistName);
        if (savedArtist) {
          logger.info("Artist already exists in DB, don't search online", {
            artistName,
          });
          artistIdsForEvent.push(savedArtist.id);
          continue;
        }

        const newArtist = await this.findArtistDataOnline(artistName);
        newArtists.push(newArtist);
      }

      try {
        // save artists to DB (if any. we need if since saving empty array to db throws error)
        if (newArtists.length > 0) {
          logger.info("Saving artists to DB", { count: newArtists.length });
          const savedArtists = await MusicArtistModel.addMany(newArtists);
          const savedArtistIds = savedArtists.map((a) => a.id);
          artistIdsForEvent.push(...savedArtistIds);
          dbStats.savedArtistCount += savedArtists.length;
          this.totalDbStats.savedArtists.push(...newArtists.map((a) => a.name));
        }

        // save events to DB
        logger.info("Saving event to DB");

        // TODO this is bad but it'll do. after we refactor query to handle music-artist relationship + toNew method we can delete this
        // @ts-ignore
        delete event.artistNames;

        const savedEvent = await MusicEventModel.addOne(event);
        const savedEventId = savedEvent.id;
        dbStats.savedEventCount++;
        this.totalDbStats.savedEvents.push(event.link);

        // save event-artist relationships to DB
        logger.info("Saving event-artist relationships to DB");
        const eventArtistPairs = artistIdsForEvent.map((artistId) => ({
          artistId,
          eventId: savedEventId,
        }));
        const savedEventArtistPairs = await DatabaseManager.db
          .insertInto("musicEventArtists")
          .values(eventArtistPairs)
          .onConflict((oc) => oc.columns(["artistId", "eventId"]).doNothing())
          .returningAll()
          .execute();
        dbStats.savedEventArtistPairCount += savedEventArtistPairs.length;
        this.totalDbStats.savedEventArtistPairCount +=
          savedEventArtistPairs.length;

        logger.info("Saved all event models successfully", {
          event: event.link,
          dbStats,
        });
      } catch (error: any) {
        logger.error("Error saving event models", {
          event,
          newArtists: newArtists.map((a) => a.name),
          error: ErrorUtils.toObject(error),
        });
      }
    }
  }

  private static async findArtistDataOnline(
    artistName: string
  ): Promise<NewMusicArtist> {
    try {
      logger.info("Searching online for artist metadata", { artistName });
      const spotifyArtist = await SpotifyService.searchArtistByName(artistName);

      logger.info("Spotify artist found", { spotifyArtist });

      return MusicArtistModel.toNew(artistName, spotifyArtist);
    } catch (error: any) {
      logger.error("Error searching online for artist metadata", {
        artistName,
        error: ErrorUtils.toObject(error),
      });

      // it's okay if we couldn't find anything online, just return bare-bones artist
      return MusicArtistModel.toNew(artistName, undefined);
    }
  }
}
