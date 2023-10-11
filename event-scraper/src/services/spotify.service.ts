import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { Config } from "../utils/config";
import { logger } from "../utils/logger.js";

export class SpotifyService {
  private static readonly spotify = SpotifyApi.withClientCredentials(
    Config.VITE_SPOTIFY_CLIENT_ID,
    Config.VITE_SPOTIFY_CLIENT_SECRET,
    []
  );

  private static readonly SEARCH_LIMIT = 5;

  public static async searchArtistByName(artistName: string) {
    logger.info("Searching for artist", { artistName });

    const res = await this.spotify.search(
      artistName,
      ["artist"],
      undefined,
      this.SEARCH_LIMIT
    );

    // first pass is seeing if list is size === 1

    // second pass is searching for exact name match

    // third pass is... nothing lol
    // how to handle case where artist name matches but it's the wrong one?
    // guess there's nothing we can do except 1) manual check 2) community check

    return res;
  }
}

// SpotifyService.searchArtistByName("야자수").then((res) =>
//   console.log(res.artists.items)
// );
