import { logger } from "./utils/logger";
import InstagramAccountData from "./static/instagram-account-data.json";
import { InstagramService } from "./services/instagram.service";
import { ChatGptService } from "./services/chatgpt.service";
import { NewMusicEvent, toNewMusicEvent } from "./db/models/event";

export class Server {
  public static async start() {
    logger.info("Starting scraper");

    const posts = await InstagramService.fetchPostsByAccountId(
      "strangefruit.seoul"
    );

    // extract event data via chatgpt
    const events: NewMusicEvent[] = []; // TODO type this to Event
    for (const post of posts) {
      try {
        const parsedEvent = await ChatGptService.extractInstagramPostEventData(
          post
        );

        if (!parsedEvent) {
          logger.warning("Couldn't extract event data from post", { post });
          continue;
        }

        const event = toNewMusicEvent(parsedEvent, post);
        events.push(event);
      } catch (error) {
        logger.error("ChatGpt event data extraction failed", {
          error,
          post,
        });
      }
    }

    console.log("wow", events);
  }
}
