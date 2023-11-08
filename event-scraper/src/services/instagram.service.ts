import axios from "axios";
import { Config } from "../utils/config";
import { logger } from "../utils/logger";

export type InstagramPost = {
  id: string;
  accountId: string;
  timestamp: number;
  link: string;
  text?: string;
};

export type InstagramAccount = {
  username: string;
  name: string;
  externalLink: string;
  businessAddressJson?: string;
  businessEmail?: string;
  businessPhoneNumber?: string;
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
    logger.info("Scraping instagram posts", { accountId });

    const response = await axios.get(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${accountId}`,
      { headers: this.HEADERS }
    );

    // TODO improve error message or check if i even need
    if (response.status !== 200) throw new Error("Error fetching instagram");

    const body = response.data;

    console.log("hehehehe", JSON.stringify(body, null, 2));

    // TODO add typing here?
    const edges = (
      body.data.user.edge_owner_to_timeline_media.edges as any[]
    ).slice(0, maxPosts);

    const posts = edges.map((edge) => {
      const node = edge.node;
      const post: InstagramPost = {
        id: node.id,
        timestamp: node.taken_at_timestamp,
        link: `https://www.instagram.com/p/${node.shortcode}/`,
        text: node.edge_media_to_caption.edges[0]?.node.text,
        accountId,
      };

      return post;
    });

    logger.info("Finished scraping instagram posts", {
      accountId,
      posts: posts.map((p) => p.link),
    });

    return posts;
  }

  public static async fetchAccountInfo(accountId: string) {
    logger.info("Scraping instagram account info", { accountId });

    const response = await axios.get(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${accountId}`,
      { headers: this.HEADERS }
    );

    // TODO improve error message
    if (response.status !== 200) throw new Error("Error fetching instagram");

    const body = response.data;
  }
}
