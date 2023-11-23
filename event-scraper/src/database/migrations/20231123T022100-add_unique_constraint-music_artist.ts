import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("music_artist")
    .addUniqueConstraint("music_artist_name_country_key", ["name", "country"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("music_artist")
    .dropConstraint("music_artist_name_country_key")
    .execute();
}
