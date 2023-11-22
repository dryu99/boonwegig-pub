import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("venue")
    .addColumn("slug", "text", (col) => col.unique())
    .execute();

  // populate slug column
  await sql`
    UPDATE venue 
    SET slug = LOWER(REPLACE(name, ' ', '-'));`.execute(db);

  await db.schema
    .alterTable("venue")
    .alterColumn("slug", (col) => col.setNotNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("venue").dropColumn("slug").execute();
}
