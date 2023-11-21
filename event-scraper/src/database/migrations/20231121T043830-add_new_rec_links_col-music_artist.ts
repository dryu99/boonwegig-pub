import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("music_artist")
    .addColumn("recommended_links", sql`text[]`)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("music_artist")
    .dropColumn("recommended_links")
    .execute();
}
