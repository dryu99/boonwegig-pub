import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("music_artist")
    .renameColumn("instagram_id", "instagram_username")
    .execute();

  await db.schema
    .alterTable("venue")
    .renameColumn("instagram_id", "instagram_username")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("venue")
    .renameColumn("instagram_username", "instagram_id")
    .execute();

  await db.schema
    .alterTable("music_artist")
    .renameColumn("instagram_username", "instagram_id")
    .execute();
}
