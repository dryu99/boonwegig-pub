import axios, { AxiosError, AxiosResponse } from "axios";
import { Config } from "../utils/config";
import { logger } from "../utils/logger";
import { ErrorUtils } from "../utils/error";

export class ExternalScraperService {
  public static async fetchViaWebScrapingAI(
    url: string,
    options: {
      proxy: "residential" | "datacenter";
      timeout: number;
      js: boolean;
    }
  ): Promise<AxiosResponse> {
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

        return response;
      } catch (error: any) {
        // TODO when you find out what the specific error code is for when you run out of api credits, handle it here
        logger.error("webscraping.ai request failed", {
          error: ErrorUtils.toObject(error),
        });

        // let caller handle 404s
        if (error instanceof AxiosError && error.response?.status === 404)
          throw error;

        // now try again with a different key
      }
    }

    throw new Error("Failed to make webscraping.ai request");
  }
}
