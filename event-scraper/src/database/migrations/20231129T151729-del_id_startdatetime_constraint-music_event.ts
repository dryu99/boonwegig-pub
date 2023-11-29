import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("music_event")
    .dropConstraint("music_event_venue_id_start_date_time_key")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("music_event")
    .addUniqueConstraint("music_event_venue_id_start_date_time_key", [
      "venue_id",
      "start_date_time",
    ])
    .execute();
}
