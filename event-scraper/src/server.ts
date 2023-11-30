import { logger } from "./utils/logger";
import { InstagramPost, InstagramService } from "./services/instagram.service";
import { ChatGptService } from "./services/chatgpt.service";
import {
  MusicEventModel,
  NewMusicEventWithArtists,
} from "./database/models/music-event";
import { SavedVenue, VenueModel } from "./database/models/venue";
import { ExternalScraperService } from "./services/external-scraper.service";
import ErrorTrackerService from "./services/error-tracker.service";

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

    const venues = await VenueModel.getAllScrapeable();
    logger.info("Retrieved venues from DB", { count: venues.length });

    for (const venue of venues) {
      logger.info("Processing venue", {
        name: venue.name,
        instagramUsername: venue.instagramUsername,
        country: venue.country,
        city: venue.city,
      });

      try {
        // get instagram posts
        const posts = await InstagramService.fetchUserPosts(
          venue.instagramUsername
        );

        if (!posts) {
          logger.error(
            "Tried fetching posts but username doesn't exist, skip",
            { venueInstagramUsername: venue.instagramUsername }
          );
          continue;
        }

        // parse events from posts
        const events = await this.parseEventsFromVenuePosts(venue, posts);
        logger.info("Extracted events from posts", { count: events.length });

        // save data models to DB
        logger.info("Saving models to DB");
        await this.saveEventsWithArtists(events);
      } catch (error: any) {
        logger.error("Venue processing failed, move on to next venue", {
          venueInstagramUsername: venue.instagramUsername,
          error: error.message,
        });
        ErrorTrackerService.captureException(error, {
          venueInstagramUsername: venue.instagramUsername,
        });
      }
    }

    logger.info("Finished processing all venues", {
      venues: venues.map((v) => v.instagramUsername),
      totalDbStats: {
        savedEventArtistPairCount: this.totalDbStats.savedEventArtistPairCount,
        savedEventsCount: this.totalDbStats.savedEvents.length,
        savedArtistsCount: this.totalDbStats.savedArtists.length,
        savedEvents: this.totalDbStats.savedEvents,
        savedArtists: this.totalDbStats.savedArtists,
      },
      totalChatGptUsageStats: ChatGptService.totalUsageStats,
      totalExternalScraperUsage: ExternalScraperService.totalUsageStats,
    });
  }

  // INVARIANT: posts are ordered from newest to oldest
  private static async parseEventsFromVenuePosts(
    venue: SavedVenue,
    posts: InstagramPost[]
  ): Promise<NewMusicEventWithArtists[]> {
    const events: NewMusicEventWithArtists[] = [];
    for (const post of posts) {
      try {
        logger.info("Processing post", {
          ...post,
          text: post.text?.substring(0, 50),
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
          ...post,
          text: post.text?.substring(0, 50),
          parsedEvent,
        });

        MusicEventModel.validateParsed(parsedEvent);

        const event = MusicEventModel.toNew(parsedEvent, post, venue);
        events.push(event);
      } catch (error: any) {
        logger.error("Event parsing failed for post", {
          ...post,
          text: post.text?.substring(0, 50),
          error: {
            message: error.message,
            data: error.data,
          },
        });

        ErrorTrackerService.captureException(error, {
          venueInstagramUsername: venue.instagramUsername,
          postLink: post.link,
        });
      }
    }

    return events;
  }

  // INVARIANT: assume all events have at least 1 artist
  private static async saveEventsWithArtists(
    events: NewMusicEventWithArtists[]
  ) {
    const dbStats = {
      savedEventCount: 0,
      savedArtistCount: 0,
      savedEventArtistPairCount: 0,
    };

    for (const event of events) {
      logger.info("Saving event with artists to DB", { event });

      try {
        const dbResult = await MusicEventModel.addOneWithArtists(event);

        // record db stats
        dbStats.savedArtistCount += dbResult.savedArtists.length;
        this.totalDbStats.savedArtists.push(
          ...dbResult.savedArtists.map((a) => a.name)
        );

        dbStats.savedEventCount++;
        this.totalDbStats.savedEvents.push(dbResult.savedMusicEvent.link);

        dbStats.savedEventArtistPairCount +=
          dbResult.savedMusicEventArtists.length;
        this.totalDbStats.savedEventArtistPairCount +=
          dbResult.savedMusicEventArtists.length;

        logger.info("Event saved to DB successfully", { dbResult, dbStats });
      } catch (error: any) {
        logger.error("Error saving event models to DB", {
          event,
          error: error.message,
        });
        ErrorTrackerService.captureException(error, { event });
      }
    }
  }
}
