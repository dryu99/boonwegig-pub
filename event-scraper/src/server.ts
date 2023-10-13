import { logger } from "./utils/logger";
import { InstagramPost, InstagramService } from "./services/instagram.service";
import { ChatGptService } from "./services/chatgpt.service";
import { MusicEventModel, NewMusicEvent } from "./database/models/music-event";
import { SavedVenue, VenueModel } from "./database/models/venue";
import { SpotifyService } from "./services/spotify.service";
import {
  MusicArtistModel,
  NewMusicArtist,
} from "./database/models/music-artist";

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

        // save new artists to DB
        // this.saveMusicArtists(events.map((e) => e.).flat());

        // TODO save artist-music_event relationships to DB

        // save events to DB
        logger.info("Saving events");
        await MusicEventModel.addMany(events);
      } catch (error) {
        logger.error("Venue processing failed", {
          instagramId: venue.instagramId,
          error,
        });
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
        const event = MusicEventModel.toNew(parsedEvent, post, venue);
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

  private static async saveMusicArtists(artistNames: string[]): Promise<void> {
    const artists: NewMusicArtist[] = [];
    for (const artistName of artistNames) {
      try {
        logger.info("Searching online for artist metadata", { artistName });
        const spotifyArtist = await SpotifyService.searchArtistByName(
          artistName
        );

        logger.info("Spotify artist found", { spotifyArtist });

        artists.push(MusicArtistModel.toNew(artistName, spotifyArtist));
      } catch (error) {
        logger.error("Error searching online for artist metadata", {
          artistName,
          error,
        });

        // we still want to add artist to DB even if we can't find extra metadata
        artists.push(MusicArtistModel.toNew(artistName, undefined));
      }
    }

    try {
      logger.info("Saving artists", { count: artists.length });
      await MusicArtistModel.addMany(artists);
    } catch (error) {
      logger.error("Error saving artists", { error });
    }
  }
}
