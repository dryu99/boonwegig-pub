import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("music_artist")
    .renameColumn("instagram_id", "instagram_username");

  await db.schema
    .alterTable("venue")
    .renameColumn("instagram_id", "instagram_username");
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("venue")
    .renameColumn("instagram_username", "instagram_id");

  await db.schema
    .alterTable("music_artist")
    .renameColumn("instagram_username", "instagram_id");
}
