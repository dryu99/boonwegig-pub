import axios, { AxiosError, AxiosResponse } from "axios";
import { Config, resolveByEnv } from "../utils/config";
import { logger } from "../utils/logger";
import { wait } from "../utils/timeout";
import ErrorTrackerService from "./error-tracker.service";
import { AppError } from "../utils/error";
import { DeepScrapedInstagramUser } from "./instagram.service";

export class ExternalScraperService {
  public static totalUsageStats = {
    apiRequestSuccessCount: 0,
    apiRequestFailCount: 0,
  };

  private static readonly WAIT_TIME_MS = resolveByEnv({
    prod: 15 * 1000,
    dev: 5 * 1000,
  });

  public static async fetch(
    instagramUsername: string
  ): Promise<DeepScrapedInstagramUser> {
    // repeat scrape fetch thrice
    for (let i = 0; i < 3; i++) {
      try {
        logger.info("Making external scrape request", { attempt: i });
        const response = this.rapidApiFetch(instagramUsername);

        logger.info("Successfully made external scrape request");
        this.totalUsageStats.apiRequestSuccessCount++;
        return response;
      } catch (error: any) {
        const errorContext = {
          instagramUsername,
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
      { instagramUsername }
    );
  }

  private static async scrapingFishFetch(instagramUsername: string) {
    const url = `https://www.instagram.com/${instagramUsername}/?__a=1&__d=1`;
    const response = await axios.get("https://scraping.narf.ai/api/v1/", {
      params: {
        url,
        api_key: Config.SCRAPING_FISH_API_KEY,
      },
    });
    return response.data;
  }

  private static async rapidApiFetch(instagramUsername: string) {
    const options = {
      method: "GET",
      // TODO for other rapidapi url
      // method: "POST",
      url: "https://instagram243.p.rapidapi.com/userinfo/instagram",
      // TODO for other rapidapi url
      // url: "https://rocketapi-for-instagram.p.rapidapi.com/instagram/user/get_info",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": Config.RAPID_API_KEY,
        // TODO for other rapidapi url
        // "X-RapidAPI-Host": "rocketapi-for-instagram.p.rapidapi.com",
        "X-RapidAPI-Host": "instagram243.p.rapidapi.com",
      },
      data: { username: instagramUsername },
    };

    const response = await axios.request(options);
    return response.data.response.body.data;
  }
}
