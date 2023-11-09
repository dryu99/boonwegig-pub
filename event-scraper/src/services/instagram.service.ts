import axios from "axios";
import { Config } from "../utils/config";
import { logger } from "../utils/logger";
import { Nullable, toUndef } from "../utils/nullable";

export type InstagramPost = {
  id: string;
  accountId: string;
  timestamp: number;
  link: string;
  text?: string;
};

export type InstagramAccount = {
  username: string;
  name?: string;
  externalLink?: string;
  businessAddressJson?: string;
  businessEmail?: string;
  businessPhoneNumber?: string;
};

type ScrapedInstagramAccountMetadata = {
  full_name: Nullable<string>;
  external_url: Nullable<string>;
  business_address_json: Nullable<string>;
  business_email: Nullable<string>;
  business_phone_number: Nullable<string>;
  edge_owner_to_timeline_media: {
    // TODO maybe nullable
    edges: any[];
  };
};

// TODO maybe add caching here?
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
    logger.info("Fetching instagram posts", { accountId });

    const user = await this.scrapeUserData(accountId);
    const edges = user.edge_owner_to_timeline_media.edges.slice(0, maxPosts);

    const posts = edges.map((edge) => {
      const node = edge.node;
      const post: InstagramPost = {
        id: node.id,
        timestamp: node.taken_at_timestamp,
        link: `https://www.instagram.com/p/${node.shortcode}/`,
        text: toUndef(node.edge_media_to_caption.edges[0]?.node.text),
        accountId,
      };

      return post;
    });

    logger.info("Finished fetching instagram posts", {
      accountId,
      posts: posts.map((p) => p.link),
    });

    return posts;
  }

  public static async fetchAccountInfo(
    accountId: string
  ): Promise<InstagramAccount> {
    logger.info("Fetching instagram account info", { accountId });

    const user = await this.scrapeUserData(accountId);

    const account: InstagramAccount = {
      username: accountId,
      name: toUndef(user.full_name),
      externalLink: toUndef(user.external_url),
      businessAddressJson: toUndef(user.business_address_json),
      businessEmail: toUndef(user.business_email),
      businessPhoneNumber: toUndef(user.business_phone_number),
    };

    logger.info("Finished fetching instagram account info", { account });

    return account;
  }

  private static async scrapeUserData(
    username: string
  ): Promise<ScrapedInstagramAccountMetadata> {
    logger.info("Scraping instagram user", { username });

    const response = await axios.get(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
      { headers: this.HEADERS }
    );

    const body = response.data;
    return body.data.user;
  }
}
