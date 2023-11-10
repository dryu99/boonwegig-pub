import { AxiosError } from "axios";
import { Config } from "../utils/config";
import { logger } from "../utils/logger";
import { Nullable, toUndef } from "../utils/nullable";
import Cache from "file-system-cache";
import { ExternalScraperService } from "./external-scraper.service";
import { ErrorUtils } from "../utils/error";
import ErrorTrackerService from "./error-tracker.service";

export type InstagramPost = {
  id: string;
  username: string;
  timestamp: number;
  link: string;
  text?: string;
};

export type InstagramUser = {
  id: string;
  username: string;
  name?: string;
  externalLink?: string;
  businessAddressJson?: string;
  businessEmail?: string;
  businessPhoneNumber?: string;
};

type ScrapedInstagramUser = {
  full_name: Nullable<string>;
  external_url: Nullable<string>;
  business_address_json: Nullable<string>;
  business_email: Nullable<string>;
  business_phone_number: Nullable<string>;
  username: string;
  id: string;
  edge_owner_to_timeline_media: {
    edges: any[];
  };
};

type DeepScrapedInstagramUser = {
  graphql: {
    user: ScrapedInstagramUser;
  };
};

// TODO maybe add caching here?
export class InstagramService {
  private static readonly HEADERS = {
    cookie: Config.INSTAGRAM_COOKIE,
    "user-agent": Config.INSTAGRAM_USER_AGENT,
    "x-ig-app-id": Config.INSTAGRAM_X_IG_APP_ID,
  };
  public static scrapedUserCache = Cache({
    basePath: "./.cache",
    ns: "scraped-instagram-users",
    ttl: 60 * 60 * 24 * 1, // cache for 24 hrs
  }); // key: insta_username -> val: ScrapedInstagramUser

  public static async fetchUserPosts(
    username: string,
    maxPosts: number = 12 // max is 12
  ): Promise<
    InstagramPost[] | undefined // implies username couldn't be found on internet
  > {
    logger.info("Fetching instagram posts", { username });
    const scrapedUser = await this.getScrapedUser(username);
    if (scrapedUser === undefined) return undefined;

    const posts = this.parsePostsFromScrapedUser(scrapedUser, maxPosts);
    logger.info("Finished fetching instagram posts", {
      username: username,
      posts: posts.map((p) => p.link),
    });

    return posts;
  }

  public static async fetchUser(
    username: string
  ): Promise<InstagramUser | undefined> {
    logger.info("Fetching instagram user", { username });
    const scrapedUser = await this.getScrapedUser(username);
    if (scrapedUser === undefined) return undefined;

    const user: InstagramUser = {
      id: scrapedUser.id,
      username,
      name: toUndef(scrapedUser.full_name),
      externalLink: toUndef(scrapedUser.external_url),
      businessAddressJson: toUndef(scrapedUser.business_address_json),
      businessEmail: toUndef(scrapedUser.business_email),
      businessPhoneNumber: toUndef(scrapedUser.business_phone_number),
    };

    logger.info("Finished fetching instagram user", { user });

    return user;
  }

  private static async getScrapedUser(
    username: string
  ): Promise<ScrapedInstagramUser | undefined> {
    // check cache first
    const cachedUser: ScrapedInstagramUser =
      this.scrapedUserCache.getSync(username);
    if (cachedUser !== undefined) {
      logger.info("user was cached, skip scraping");
      return cachedUser;
    }

    // scrape internet
    const scrapedUser = await this.scrapeUserData(username);
    if (scrapedUser === undefined) return undefined;

    // cache user
    this.scrapedUserCache.setSync(username, scrapedUser);
    return scrapedUser;
  }

  private static async scrapeUserData(
    username: string
  ): Promise<ScrapedInstagramUser | undefined> {
    logger.info("Scraping instagram user", { username });
    try {
      const response = await ExternalScraperService.fetchViaWebScrapingAI(
        `https://www.instagram.com/${username}/?__a=1&__d=1`,
        {
          proxy: "residential",
          timeout: 30 * 1000,
          js: false,
        }
      );

      const body: DeepScrapedInstagramUser = response.data;
      return body.graphql.user;
    } catch (error: any) {
      logger.error("Failed to scrape instagram user", {
        error: error.message,
      });
      ErrorTrackerService.captureException(error, { username });

      if (!(error instanceof AxiosError)) throw new Error(error);
      if (error.response?.status === 404) {
        logger.warn("Instagram user not found", { username });
        return undefined;
      }

      throw error;
    }
  }

  private static parsePostsFromScrapedUser(
    user: ScrapedInstagramUser,
    maxPosts: number
  ): InstagramPost[] {
    const edges = user.edge_owner_to_timeline_media.edges.slice(0, maxPosts);

    const posts = edges.map((edge) => {
      const node = edge.node;
      const post: InstagramPost = {
        id: node.id,
        timestamp: node.taken_at_timestamp,
        link: `https://www.instagram.com/p/${node.shortcode}/`,
        text: toUndef(node.edge_media_to_caption.edges[0]?.node.text),
        username: user.username,
      };

      return post;
    });

    return posts;
  }
}
