import { Insertable, Selectable } from "kysely";
import { ReviewStatus } from "../../utils/types";
import { MusicArtist, Venue } from "../db-schemas";
import { DatabaseManager } from "../db-manager";

export type NewVenue = Insertable<Venue>;
export type SavedVenue = Selectable<Venue>;

export class VenueModel {
  public static getOneByInstagramUsername(
    instagramUsername: string
  ): Promise<SavedVenue | undefined> {
    return DatabaseManager.db
      .selectFrom("venue")
      .where("instagramUsername", "=", instagramUsername)
      .selectAll()
      .executeTakeFirst();
  }

  public static getAllScrapable(): Promise<SavedVenue[]> {
    return DatabaseManager.db
      .selectFrom("venue")
      .where("reviewStatus", "=", "VALID")
      .selectAll()
      .execute();
  }

  public static addOne(newVenue: NewVenue): Promise<SavedVenue | undefined> {
    return DatabaseManager.db
      .insertInto("venue")
      .values(newVenue)
      .returningAll()
      .executeTakeFirst();
  }

  public static addMany(newVenues: NewVenue[], skipDuplicates: boolean) {
    return DatabaseManager.db
      .insertInto("venue")
      .values(newVenues)
      .$if(skipDuplicates, (qb) =>
        qb.onConflict((co) => co.column("instagramUsername").doNothing())
      )
      .execute();
  }
}
