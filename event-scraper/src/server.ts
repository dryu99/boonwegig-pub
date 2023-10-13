import { logger } from "./utils/logger";
import { InstagramPost, InstagramService } from "./services/instagram.service";
import { ChatGptService } from "./services/chatgpt.service";
import { MusicEventModel, NewMusicEvent } from "./database/models/music-event";
import { SavedVenue, VenueModel } from "./database/models/venue";

export class Server {
  public static async start() {
    logger.info("Starting scraper...");

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

        // save events to DB
        logger.info("Saving events");
        await MusicEventModel.addMany(events);
      } catch (error) {
        logger.error("Venue processing failed", { error });
      }
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
}
