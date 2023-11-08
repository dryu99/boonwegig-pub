import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    ALTER TABLE ONLY "music_event"
    ADD CONSTRAINT "music_event_venue_id_start_date_time_key" UNIQUE ("venue_id", "start_date_time");
    `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
  ALTER TABLE IF EXISTS ONLY "music_event" 
  DROP CONSTRAINT IF EXISTS "music_event_venue_id_start_date_time_key";
  `.execute(db);
}
