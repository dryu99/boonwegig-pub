import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("music_event")
    .addColumn("slug", "text", (col) => col.unique())
    .execute();

  // populate slug column
  await sql`
    UPDATE music_event 
    SET slug = venue.slug || '-' || substring(music_event.id::text from 1 for 8)
    FROM venue
    WHERE music_event.venue_id = venue.id;`.execute(db);

  await db.schema
    .alterTable("music_event")
    .alterColumn("slug", (col) => col.setNotNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("music_event").dropColumn("slug").execute();
}
