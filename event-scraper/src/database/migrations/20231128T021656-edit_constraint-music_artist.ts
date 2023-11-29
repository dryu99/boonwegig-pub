import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("music_artist")
    .dropConstraint("music_artist_name_country_key")
    .execute();

  await db.schema
    .alterTable("music_artist")
    .addUniqueConstraint("music_artist_name_key", ["name"])
    .execute();

  // TODO remove exiting unique constraint and add new one JUST ON NAME
  // TODO in scraper, make sure to do lowercase comparisons
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("music_artist")
    .dropConstraint("music_artist_name_key")
    .execute();

  await db.schema
    .alterTable("music_artist")
    .addUniqueConstraint("music_artist_name_country_key", ["name", "country"])
    .execute();
}
