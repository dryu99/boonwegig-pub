import { iwa } from "../custom-npm/instagram-without-api-node.js";
import { Config } from "../utils/config";
import { logger } from "../utils/logger";

export type InstagramPost = {
  id: string;
  accountId: string;
  time: number;
  link: string;
  text?: string;
  location: string;
};

export class InstagramService {
  private static readonly HEADERS = {
    cookie: Config.INSTAGRAM_COOKIE,
    "user-agent": Config.INSTAGRAM_USER_AGENT,
    "x-ig-app-id": Config.INSTAGRAM_X_IG_APP_ID,
  };

  public static async fetchPostsByAccountId(
    accountId: string,
    maxPosts: number = 12 // max is 12
  ): Promise<InstagramPost[]> {
    logger.info("Scraping instagram posts from account", { accountId });

    const fetchedPosts: any[] = await iwa({
      base64images: false, // <!-- optional, but without you will be not able to save images.. it increases the size of the json file
      base64imagesCarousel: false, // <!-- optional but not recommended, it increases the size of the json file
      base64videos: false, // <!-- optional but not recommended, it increases the size of the json file

      headers: this.HEADERS,

      maxImages: maxPosts,
      file: "instagram-cache.json", // <!-- optional, instagram-cache.json is by default
      pretty: true,
      time: 0, // this option is kinda dumb, it won't let me make parallel requests since if i make a request within the timeframe, it'll just pull whatevers in the cache

      id: accountId,
    });

    const resultPosts = fetchedPosts.map((p) => ({ ...p, accountId }));
    return resultPosts;
  }
}
