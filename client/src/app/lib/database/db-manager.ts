import { Pool } from "pg";
import { CamelCasePlugin, Kysely, PostgresDialect, Selectable } from "kysely";
import { DB, MusicArtist, MusicEvent, Venue } from "./db-schemas";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";

export type ClientMusicEvent = Pick<
  Selectable<MusicEvent>,
  "id" | "link" | "isFree" | "startDateTime"
> & {
  artists: ClientArtist[];
  venue: ClientVenue | null; // TODO this null shouldn't be necessary, if the venue id exists then there should be a corresponding venue
};

export type ClientArtist = Pick<
  Selectable<MusicArtist>,
  "id" | "name" | "genre"
>;

export type ClientVenue = Pick<
  Selectable<Venue>,
  "id" | "name" | "instagramId" | "city" | "country"
>;

// TODO this is duplicated from event-scraper. we can do better (monorepo or sth to share code)
//      also db-schemas is duplicated.
export class DatabaseManager {
  private static pool = new Pool({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    max: 10,
  });
  private static dialect = new PostgresDialect({
    pool: this.pool,
  });
  public static db = new Kysely<DB>({
    dialect: this.dialect,
    plugins: [new CamelCasePlugin()],
  });

  public static async getAllUpcomingMusicEvents(): Promise<ClientMusicEvent[]> {
    return this.db
      .selectFrom("musicEvent")
      .select((eb) => [
        // music event fields
        "musicEvent.id",
        "musicEvent.isFree",
        "musicEvent.startDateTime",
        "musicEvent.link",

        // artist fields (have to use helper to produce nested array)
        jsonArrayFrom(
          eb
            .selectFrom("musicEventArtists")
            // TODO lmao figure out learn inner join vs left join
            .innerJoin(
              "musicArtist",
              "musicArtist.id",
              "musicEventArtists.artistId"
            )
            .select(["musicArtist.id", "musicArtist.name", "musicArtist.genre"])
            .whereRef("musicEventArtists.eventId", "=", "musicEvent.id")
        ).as("artists"),

        // venue fields
        jsonObjectFrom(
          eb
            .selectFrom("venue")
            .select([
              "venue.id",
              "venue.name",
              "venue.instagramId",
              "venue.city",
              "venue.country",
            ])
            .whereRef("venue.id", "=", "musicEvent.venueId")
        ).as("venue"),
      ])
      .execute();
  }
}
