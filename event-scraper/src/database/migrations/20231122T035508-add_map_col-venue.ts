import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("venue")
    .addColumn("external_maps_json", "json")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("venue")
    .dropColumn("external_maps_json")
    .execute();
}
