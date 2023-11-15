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

  public static async fetch(url: string): Promise<AxiosResponse> {
    // repeat scrape fetch thrice
    for (let i = 0; i < 3; i++) {
      try {
        logger.info("Making external scrape request", { attempt: i });
        const response = await axios.get("https://scraping.narf.ai/api/v1/", {
          params: {
            url,
            api_key: Config.SCRAPING_FISH_API_KEY,
          },
        });

        logger.info("Successfully made external scrape request");
        this.totalUsageStats.apiRequestSuccessCount++;
        return response;
      } catch (error: any) {
        const errorContext = {
          url,
          attempt: i,
        };

        // TODO when you find out what the specific error code is for when you run out of api credits, handle it here
        logger.error("external scrape request failed", {
          error: error.message,
          ...errorContext,
        });
        ErrorTrackerService.captureException(error, errorContext);
        this.totalUsageStats.apiRequestFailCount++;

        if (
          error instanceof AxiosError &&
          [401, 400].includes(error.response!.status)
        )
          throw error;

        // otherwise, wait and try again
        await wait(this.WAIT_TIME_MS);
      }
    }

    throw new AppError(
      "retries exhausted, failed to make external scrape request",
      { url }
    );
  }
}
