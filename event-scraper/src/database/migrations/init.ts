import { CreateTableBuilder, Kysely, sql } from "kysely";

// TODO i think i still need to add defaults for uuids
export async function up(db: Kysely<any>): Promise<void> {
  // TODO add extension for uuid?
  // TODO how to add udpated_at triggers for every table?

  await db.schema
    .createTable("music_artist")
    .addColumn("id", "uuid", (col) => col.primaryKey())
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
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("link", "text", (col) => col.notNull())
    .addColumn("review_status", "text", (col) => col.notNull())
    .addColumn("venue_id", "uuid", (col) => col.references("venue.id"))
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

  await db.schema
    .createTable("venue")
    .addColumn("id", "uuid", (col) => col.primaryKey())
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

  // TODO add primary key composite constraints
  // TODO add foreign key constriants
  // TODO add updated_at created_at?
  await db.schema
    .createTable("music_event_artists")
    .addColumn("event_id", "uuid", (col) => col.primaryKey())
    .addColumn("artist_id", "uuid", (col) => col.primaryKey())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("music_artist").execute();
  await db.schema.dropTable("music_event").execute();
  await db.schema.dropTable("venue").execute();
}
