import { Insertable, Selectable } from "kysely";
import { MusicArtist } from "../db";
import { DatabaseManager } from "../db-manager";

// TODO rename file to music-artist

export type NewMusicArtist = Insertable<MusicArtist>;
export type SavedMusicArtist = Selectable<MusicArtist>;

export class MusicArtistModel {
  async addOne(
    newArtist: NewMusicArtist
  ): Promise<SavedMusicArtist | undefined> {
    return DatabaseManager.db
      .insertInto("musicArtist")
      .values(newArtist)
      .returningAll()
      .executeTakeFirst();
  }

  async addMany(newArtists: NewMusicArtist[]) {
    return DatabaseManager.db
      .insertInto("musicArtist")
      .values(newArtists)
      .execute();
  }
}
