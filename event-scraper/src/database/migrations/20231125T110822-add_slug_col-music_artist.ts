import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("music_artist")
    .addColumn("slug", "text", (col) => col.unique())
    .execute();

  // populate slug column
  await sql`
  UPDATE music_artist
  SET slug = CASE
             WHEN TRIM(name) ~ '^[A-Za-z0-9 .\-]+$' THEN LOWER(REPLACE(TRIM(name), ' ', '-')) || '-' || SPLIT_PART(id::text, '-', 1)
             ELSE SPLIT_PART(id::text, '-', 1) || '-' || SPLIT_PART(id::text, '-', 2)
           END;`.execute(db);

  await db.schema
    .alterTable("music_artist")
    .alterColumn("slug", (col) => col.setNotNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("music_artist").dropColumn("slug").execute();
}
