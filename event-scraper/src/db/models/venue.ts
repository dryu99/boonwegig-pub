import { Insertable, Selectable } from "kysely";
import { ReviewStatus } from "../../utils/types";
import { MusicArtist, Venue } from "../db";
import { DatabaseManager } from "../db-manager";

export type NewVenue = Insertable<Venue>;
export type SavedVenue = Selectable<Venue>;

export class VenueModel {
  public static async addOne(
    newVenue: NewVenue
  ): Promise<SavedVenue | undefined> {
    return DatabaseManager.db
      .insertInto("venue")
      .values(newVenue)
      .returningAll()
      .executeTakeFirst();
  }

  public static async addMany(newVenues: NewVenue[]) {
    return DatabaseManager.db.insertInto("venue").values(newVenues).execute();
  }
}
