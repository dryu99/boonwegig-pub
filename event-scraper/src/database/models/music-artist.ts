import { Insertable, Selectable } from "kysely";
import { MusicArtist } from "../db-schemas";
import { DatabaseManager } from "../db-manager";
import { ReviewStatus, UUID } from "../../utils/types";
import { v4 as uuidv4 } from "uuid";

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

  public static async getManyByIds(ids: string[]): Promise<SavedMusicArtist[]> {
    return DatabaseManager.db
      .selectFrom("musicArtist")
      .where("id", "in", ids)
      .selectAll()
      .execute();
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
    return DatabaseManager.db
      .insertInto("musicArtist")
      .values(newArtists)
      .onConflict((oc) => oc.columns(["name", "country"]).doNothing())
      .onConflict((oc) => oc.column("instagramId").doNothing())
      .returning("id")
      .execute();
  }

  // TODO add country param?
  public static toNew(artistName: string): NewMusicArtist {
    const newId = uuidv4();
    const trimmedName = artistName.trim();

    return {
      id: newId,
      name: trimmedName,
      reviewStatus: ReviewStatus.PENDING,
      slug: this.generateSlug(artistName, newId),

      // TODO do this when scraper gets smarter (but prob not lol)
      // spotifyId: spotifyArtist?.spotifyId,
      // genre: spotifyArtist?.genre,
    };
  }

  private static generateSlug(artistName: string, id: UUID): string {
    const regex = /^[A-Za-z0-9 .\-]+$/;
    const uuidParts = id.split("-");

    if (regex.test(artistName)) {
      const artistSlugPart = artistName.toLowerCase().replace(/\s/g, "-");
      return `${artistSlugPart}-${uuidParts[0]}`;
    } else {
      return `${uuidParts[0]}-${uuidParts[1]}`;
    }
  }
}
