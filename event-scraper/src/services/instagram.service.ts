import { iwa } from "../custom-npm/instagram-without-api-node.js";
import { Config } from "../utils/config";
import { logger } from "../utils/logger";

export type InstagramPost = {
  id: string;
  accountId: string;
  time: number;
  link: string;
  text: string;
  location: string;
};

export class InstagramService {
  public static async fetchPostsByAccountId(
    accountId: string
  ): Promise<InstagramPost[]> {
    logger.info("Scraping instagram posts", { accountId });

    const fetchedPost = iwa({
      base64images: false, // <!-- optional, but without you will be not able to save images.. it increases the size of the json file
      base64imagesCarousel: false, // <!-- optional but not recommended, it increases the size of the json file
      base64videos: false, // <!-- optional but not recommended, it increases the size of the json file

      headers: {
        cookie: Config.INSTAGRAM_COOKIE,
        "user-agent": Config.INSTAGRAM_USER_AGENT,
        "x-ig-app-id": Config.INSTAGRAM_X_IG_APP_ID,
      },

      maxImages: 12, // <!-- optional, 12 is the max number
      file: "instagram-cache.json", // <!-- optional, instagram-cache.json is by default
      pretty: true,
      time: 0, // this option is kinda dumb, it won't let me make parallel requests since if i make a request within the timeframe, it'll just pull whatevers in the cache

      id: accountId,
    });

    const resultPost = {
      ...fetchedPost,
      accountId,
    };

    return resultPost;
  }
}
