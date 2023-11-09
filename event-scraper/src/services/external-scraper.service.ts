import axios from "axios";
import { Config } from "../utils/config";
import { logger } from "../utils/logger";
import { ErrorUtils } from "../utils/error";

export class ExternalScraperService {
  public async getViaWebScrapingAI(
    url: string,
    options: {
      proxy: "residential" | "datacenter";
      timeout: number;
      js: boolean;
    } = {
      proxy: "residential",
      timeout: 30 * 1000,
      js: false,
    }
  ): Promise<any> {
    for (let i = 0; i < Config.WEB_SCRAPING_API_KEYS.length; i++) {
      const apiKey = Config.WEB_SCRAPING_API_KEYS[i];
      try {
        logger.debug("Making webscraping.ai request", { attempt: i });
        const response = await axios.get("https://api.webscraping.ai/html", {
          params: {
            api_key: apiKey,
            url,
            ...options,
          },
        });

        return response.data;
      } catch (error: any) {
        logger.error("webscraping.ai request failed", {
          error: ErrorUtils.toObject(error),
        });
      }
    }

    throw new Error("Failed to make webscraping.ai request");
  }
}
