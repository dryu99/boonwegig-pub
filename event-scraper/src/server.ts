import { logger } from "./utils/logger";
import { InstagramPost, InstagramService } from "./services/instagram.service";
import { ChatGptService } from "./services/chatgpt.service";
import {
  MusicEventModel,
  NewMusicEvent,
  NewMusicEventWithArtistNames,
  NewMusicEventWithArtists,
} from "./database/models/music-event";
import { SavedVenue, VenueModel } from "./database/models/venue";
import { SpotifyService } from "./services/spotify.service";
import {
  MusicArtistModel,
  NewMusicArtist,
  SavedMusicArtist,
} from "./database/models/music-artist";
import { DatabaseManager } from "./database/db-manager";

export class Server {
  private static dbTotalStats = {
    savedEventCount: 0,
    savedArtistCount: 0,
    savedEventArtistPairCount: 0,
  };

  // this job should run around 5am KST everyday
  public static async run() {
    logger.info("Running scraper...");

    const venues = await VenueModel.getScrapableVenues();
    logger.info("Retrieved venues from DB", { count: venues.length });

    for (const venue of venues) {
      logger.info("Processing venue", {
        name: venue.name,
        instagramId: venue.instagramId,
        country: venue.country,
        city: venue.city,
      });

      try {
        // get instagram posts
        const posts = await InstagramService.fetchPostsByAccountId(
          venue.instagramId
        );
        logger.info("Fetched posts from Instagram", { count: posts.length });

        // parse events from posts
        const events = await this.parseEventsFromVenuePosts(venue, posts);
        logger.info("Extracted events from posts", { count: events.length });

        // save new artists to DB
        logger.info("Saving models to DB");
        await this.saveEventModels(events);
      } catch (error) {
        console.error(error);
        logger.error("Venue processing failed, move on to next venue", {
          instagramId: venue.instagramId,
        });
      }
    }

    logger.info("Finished scraping data for all venues", this.dbTotalStats);
  }

  private static async parseEventsFromVenuePosts(
    venue: SavedVenue,
    posts: InstagramPost[]
  ): Promise<NewMusicEventWithArtistNames[]> {
    const events: NewMusicEventWithArtistNames[] = [];
    for (const post of posts) {
      logger.info("Processing post", {
        accountId: post.accountId,
        link: post.link,
        textSnippet: post.text.slice(0, 50),
      });

      try {
        const parsedEvent = await ChatGptService.parseInstagramEvent(post);
        const event = MusicEventModel.toNew(parsedEvent, post, venue);
        events.push(event);
      } catch (error) {
        console.error(error);
        logger.error("Event parsing failed", {
          post,
        });
      }
    }

    return events;
  }

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
        // save artists to DB
        logger.info("Saving artists to DB", { count: newArtists.length });
        const savedArtists = await MusicArtistModel.addMany(newArtists);
        const savedArtistIds = savedArtists.map((a) => a.id);
        artistIdsForEvent.push(...savedArtistIds);
        dbStats.savedArtistCount += savedArtists.length;

        // save events to DB
        logger.info("Saving event to DB");
        const savedEvent = await MusicEventModel.addOne(event);
        const savedEventId = savedEvent.id;
        dbStats.savedEventCount++;

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

        logger.info("Saved all event models successfully", dbStats);
        this.dbTotalStats.savedArtistCount += dbStats.savedArtistCount;
        this.dbTotalStats.savedEventCount += dbStats.savedEventCount;
        this.dbTotalStats.savedEventArtistPairCount +=
          dbStats.savedEventArtistPairCount;
      } catch (error) {
        console.error(error);
        logger.error("Error saving event models", {
          error,
          eventLink: event.link,
          newArtists: newArtists.map((a) => a.name),
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
    } catch (error) {
      console.error(error);
      logger.error("Error searching online for artist metadata", {
        artistName,
        error,
      });

      // it's okay if we couldn't find anything online, just return bare-bones artist
      return MusicArtistModel.toNew(artistName, undefined);
    }
  }
}
