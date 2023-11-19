import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("music_event")
    .addColumn("is_recommended", "boolean")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("music_event")
    .dropColumn("is_recommended")
    .execute();
}
