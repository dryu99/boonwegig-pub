import { Insertable, Selectable } from "kysely";
import { ReviewStatus } from "../../utils/types";
import { MusicArtist, Venue } from "../db-schemas";
import { DatabaseManager } from "../db-manager";
import { InstagramUser } from "../../services/instagram.service";

export type NewVenue = Insertable<Venue>;
export type SavedVenue = Selectable<Venue>;

// initial metadata for venues that we manually set for scraper
export type ScrapeableVenue = {
  instagramUsername: string;
  city: string;
  country: string;
  externalMapsJson: {
    googleMapsUrl?: string;
    kakaoMapsUrl?: string;
    naverMapsUrl?: string;
  };
  skip: boolean;
};

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

  public static getAllScrapeable(): Promise<SavedVenue[]> {
    return DatabaseManager.db
      .selectFrom("venue")
      .where("reviewStatus", "=", "VALID")
      .selectAll()
      .execute();
  }

  public static addOne(
    newVenue: NewVenue
  ): Promise<Pick<SavedVenue, "id"> | undefined> {
    return DatabaseManager.db
      .insertInto("venue")
      .values(newVenue)
      .returning("id")
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

  public static updateOneByInstagramUsername(
    instagramUsername: string,
    venue: Partial<NewVenue>
  ): Promise<SavedVenue | undefined> {
    return DatabaseManager.db
      .updateTable("venue")
      .set(venue)
      .where("instagramUsername", "=", instagramUsername)
      .returningAll()
      .executeTakeFirst();
  }

  public static toNew(user: InstagramUser, venue: ScrapeableVenue): NewVenue {
    const name = user.name || venue.instagramUsername;

    return {
      name,
      slug: this.generateSlug(name),
      instagramUsername: venue.instagramUsername,
      instagramId: user.id,
      city: venue.city,
      country: venue.country,
      reviewStatus: ReviewStatus.PENDING,
      businessAddressJson: user.businessAddressJson,
      businessEmail: user.businessEmail,
      businessPhoneNumber: user.businessPhoneNumber,
      externalLink: user.externalLink,
      externalMapsJson: JSON.stringify(venue.externalMapsJson),
    };
  }

  private static generateSlug(name: string) {
    return name.toLowerCase().replace(/\s/g, "-");
  }
}
