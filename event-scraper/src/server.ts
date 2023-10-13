import { logger } from "./utils/logger";
import { InstagramPost, InstagramService } from "./services/instagram.service";
import { ChatGptService } from "./services/chatgpt.service";
import {
  MusicEventModel,
  NewMusicEvent,
  ParsedMusicEvent,
} from "./database/models/music-event";
import { SavedVenue, VenueModel } from "./database/models/venue";

export class Server {
  public static async start() {
    logger.info("Starting scraper...");

    const venues = await VenueModel.getScrapableVenues();
    logger.info("Retrieved venues from DB", { count: venues.length });

    for (const venue of venues) {
      logger.info("Processing venue", {
        name: venue.name,
        country: venue.country,
        city: venue.city,
      });

      const posts = await InstagramService.fetchPostsByAccountId(
        venue.instagramId
      );
      logger.info("Fetched posts from Instagram", { count: posts.length });

      const events = await this.parseEventsFromVenuePosts(venue, posts);
      logger.info("Extracted events from posts", { count: events.length });

      await this.saveEvents(events);
    }
  }

  private static async parseEventsFromVenuePosts(
    venue: SavedVenue,
    posts: InstagramPost[]
  ): Promise<NewMusicEvent[]> {
    const events: NewMusicEvent[] = [];
    for (const post of posts) {
      logger.info("Processing post", {
        accountId: post.accountId,
        link: post.link,
        textSnippet: post.text.slice(0, 50),
      });

      try {
        const parsedEvent = await ChatGptService.parseInstagramEvent(post);
        const event = MusicEventModel.toNewMusicEvent(parsedEvent, post, venue);
        events.push(event);
      } catch (error) {
        logger.error("Event parsing failed", {
          error,
          post,
        });
      }
    }

    return events;
  }

  private static async saveEvents(events: NewMusicEvent[]) {
    logger.info("Saving events", { count: events.length });

    try {
      await MusicEventModel.addMany(events);
    } catch (error) {
      logger.error("Error saving events", { error });
    }
  }
}
