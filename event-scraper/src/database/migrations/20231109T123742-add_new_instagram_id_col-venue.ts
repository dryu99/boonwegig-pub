import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("venue")
    .addColumn("instagram_id", "text", (col) => col.unique().notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("venue").dropColumn("instagram_id").execute();
}
