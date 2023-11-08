import { CreateTableBuilder, Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Extensions
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`.execute(db);

  // Tables
  await db.schema
    .createTable("venue")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`uuid_generate_v4()`)
    )
    .addColumn("instagram_id", "text", (col) => col.notNull().unique())
    .addColumn("review_status", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("country", "char(2)", (col) => col.notNull())
    .addColumn("city", "text", (col) => col.notNull())
    .addColumn("name", "text")
    .execute();

  await db.schema
    .createTable("music_artist")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`uuid_generate_v4()`)
    )
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("review_status", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("genre", "text")
    .addColumn("instagram_id", "text", (col) => col.unique())
    .addColumn("youtube_id", "text")
    .addColumn("spotify_id", "text")
    .addColumn("country", "char(2)")
    .execute();

  await db.schema
    .createTable("music_event")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`uuid_generate_v4()`)
    )
    .addColumn("link", "text", (col) => col.notNull())
    .addColumn("review_status", "text", (col) => col.notNull())
    .addColumn("venue_id", "uuid", (col) => col.references("venue.id"))
    .addForeignKeyConstraint(
      "music_event_venue_id_fkey",
      ["venue_id"],
      "venue",
      ["id"]
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("start_date_time", "timestamptz", (col) => col.notNull())
    .addColumn("event_type", "text")
    .addColumn("is_free", "boolean")
    .execute();

  // TODO add updated_at created_at?
  await db.schema
    .createTable("music_event_artists")
    .addColumn("event_id", "uuid")
    .addColumn("artist_id", "uuid")
    .addPrimaryKeyConstraint("music_event_artists_pkey", [
      "event_id",
      "artist_id",
    ])
    .addForeignKeyConstraint(
      "music_event_artists_artist_id_fkey",
      ["artist_id"],
      "music_artist",
      ["id"]
    )
    .addForeignKeyConstraint(
      "music_event_artists_event_id_fkey",
      ["event_id"],
      "music_event",
      ["id"]
    )
    .execute();

  // Functions + Triggers
  await sql`
    CREATE FUNCTION "update_updated_at_column"() RETURNS "trigger"
      LANGUAGE "plpgsql"
      AS $$
    BEGIN
      NEW."updated_at" = NOW();
      RETURN NEW;
    END;
    $$;`.execute(db);

  await sql`
    CREATE TRIGGER "update_music_artist_updated_at" BEFORE UPDATE ON "music_artist" FOR EACH ROW EXECUTE FUNCTION "update_updated_at_column"();
    CREATE TRIGGER "update_music_event_updated_at" BEFORE UPDATE ON "music_event" FOR EACH ROW EXECUTE FUNCTION "update_updated_at_column"();
    CREATE TRIGGER "update_venue_updated_at" BEFORE UPDATE ON "venue" FOR EACH ROW EXECUTE FUNCTION "update_updated_at_column"();
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    DROP TRIGGER IF EXISTS "update_venue_updated_at" ON "venue";
    DROP TRIGGER IF EXISTS "update_music_event_updated_at" ON "music_event";
    DROP TRIGGER IF EXISTS "update_music_artist_updated_at" ON "music_artist";
    DROP FUNCTION IF EXISTS "update_updated_at_column"();
    DROP EXTENSION IF EXISTS "uuid-ossp";
  `.execute(db);

  await db.schema.dropTable("music_event_artists").execute();
  await db.schema.dropTable("music_event").execute();
  await db.schema.dropTable("music_artist").execute();
  await db.schema.dropTable("venue").execute();
}
