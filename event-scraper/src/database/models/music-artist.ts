import { Insertable, Selectable } from "kysely";
import { MusicArtist } from "../db-schemas";
import { DatabaseManager } from "../db-manager";
import { BasicSpotifyArtist } from "../../services/spotify.service";
import { ReviewStatus, UUID } from "../../utils/types";

export type NewMusicArtist = Insertable<MusicArtist>;
export type SavedMusicArtist = Selectable<MusicArtist>;

export class MusicArtistModel {
  public static async getOneByName(
    artistName: string
  ): Promise<SavedMusicArtist | undefined> {
    return DatabaseManager.db
      .selectFrom("musicArtist")
      .where("name", "=", artistName)
      .selectAll()
      .executeTakeFirst();
  }

  public static async addOne(
    newArtist: NewMusicArtist
  ): Promise<SavedMusicArtist | undefined> {
    return DatabaseManager.db
      .insertInto("musicArtist")
      .values(newArtist)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  public static async addMany(
    newArtists: NewMusicArtist[]
  ): Promise<{ id: UUID }[]> {
    return (
      DatabaseManager.db
        .insertInto("musicArtist")
        .values(newArtists)
        // .onConflict((oc) => oc.column("instagramId").doNothing()) TODO don't think i can use two onConflicts, address this later
        .returning("id")
        .execute()
    );
  }

  public static toNew(
    artistName: string,
    spotifyArtist?: BasicSpotifyArtist
  ): NewMusicArtist {
    return {
      name: artistName,
      reviewStatus: ReviewStatus.PENDING,
      spotifyId: spotifyArtist?.spotifyId,
      // note: we don't do this since we opted to save genres manually
      // genre: spotifyArtist?.genre,
    };
  }
}
