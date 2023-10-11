import {
  Artist as SpotifyApi_Artist,
  SpotifyApi,
} from "@spotify/web-api-ts-sdk";
import { Config } from "../utils/config";
import { logger } from "../utils/logger.js";

export type BasicSpotifyArtist = {
  genre?: string;
  spotifyId: string;
};

export class SpotifyService {
  private static readonly spotify = SpotifyApi.withClientCredentials(
    Config.VITE_SPOTIFY_CLIENT_ID,
    Config.VITE_SPOTIFY_CLIENT_SECRET,
    []
  );

  private static readonly SEARCH_LIMIT = 5;

  // TODO make an action item for this
  // how to handle case where artist name matches but it's the wrong one?
  // guess there's nothing we can do except 1) manual check 2) community check
  public static async searchArtistByName(
    artistName: string
  ): Promise<BasicSpotifyArtist | undefined> {
    logger.info("searching for artist via spotify", { artistName });

    const res = await this.spotify.search(
      artistName,
      ["artist"],
      undefined, // TODO add dynamic country code later
      this.SEARCH_LIMIT
    );

    const artists = res.artists.items;

    logger.info("artists found", {
      artists: artists.map((a) => ({ name: a.name, id: a.id })),
    });

    // If list size = 1 then exact match found e.g. 이디어츠, 양반들, 야자수
    // Seems to be the case with foreign artist names
    if (artists.length === 1) return this.toBasicSpotifyArtist(artists[0]);

    // TODO might be possible for search results > 1 AND artistName is foreign AND spotify artist name is english
    //      in that case this name search won't work
    //      could use chatgpt here to transliterate artistName to english
    //      e.g. chatgpt: 야자수 -> yajasu
    const artist = artists.find((artist) => artist.name === artistName);
    return artist !== undefined ? this.toBasicSpotifyArtist(artist) : undefined;
  }

  private static toBasicSpotifyArtist(
    artist: SpotifyApi_Artist
  ): BasicSpotifyArtist {
    return {
      spotifyId: artist.id,
      genre: artist.genres[0],
    };
  }
}

SpotifyService.searchArtistByName("yajasu").then((res) => console.log(res));
