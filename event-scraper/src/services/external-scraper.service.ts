import axios, { AxiosError, AxiosResponse } from "axios";
import { Config, resolveByEnv } from "../utils/config";
import { logger } from "../utils/logger";
import { wait } from "../utils/timeout";
import ErrorTrackerService from "./error-tracker.service";
import { AppError } from "../utils/error";

export class ExternalScraperService {
  public static totalUsageStats = {
    apiRequestSuccessCount: 0,
    apiRequestFailCount: 0,
  };

  private static readonly WAIT_TIME_MS = resolveByEnv({
    prod: 15 * 1000,
    dev: 5 * 1000,
  });

  public static async fetchViaWebScrapingAI(
    url: string,
    options: {
      proxy: "residential" | "datacenter";
      timeout: number;
      js: boolean;
    }
  ): Promise<AxiosResponse> {
    for (let i = 0; i < 3; i++) {
      // Repeat api key circulation thrice
      for (let j = 0; j < Config.WEB_SCRAPING_AI_API_CREDENTIALS.length; j++) {
        const credentials = Config.WEB_SCRAPING_AI_API_CREDENTIALS[j];
        try {
          logger.info("Making webscraping.ai request", {
            apiEmail: credentials.email,
            attempt: i,
            apiKeyIndex: j,
          });
          const response = await axios.get("https://api.webscraping.ai/html", {
            params: {
              api_key: credentials.apiKey,
              url,
              ...options,
            },
          });

          logger.info("Successfully made webscraping.ai request");
          this.totalUsageStats.apiRequestSuccessCount++;
          return response;
        } catch (error: any) {
          const errorContext = {
            url,
            attempt: i,
            apiKeyIndex: j,
          };

          // TODO when you find out what the specific error code is for when you run out of api credits, handle it here
          logger.error("webscraping.ai request failed", {
            error: error.message,
            ...errorContext,
          });
          ErrorTrackerService.captureException(error, errorContext);
          this.totalUsageStats.apiRequestFailCount++;

          // let caller handle 404s
          if (error instanceof AxiosError && error.response?.status === 404)
            throw error;

          // otherwise, wait and try next key
          await wait(this.WAIT_TIME_MS);
        }
      }

      // wait before circulating through keys again
      await wait(this.WAIT_TIME_MS);
    }

    throw new AppError("Failed to make webscraping.ai request", {
      url,
      options,
    });
  }
}
