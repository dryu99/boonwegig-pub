import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("venue")
    .addColumn("external_link", "text", (col) => col.unique())
    .addColumn("business_address_json", "json")
    .addColumn("business_email", "text", (col) => col.unique())
    .addColumn("business_phone_number", "text", (col) => col.unique())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("venue")
    .dropColumn("external_link")
    .dropColumn("business_address_json")
    .dropColumn("business_email")
    .dropColumn("business_phone_number")
    .execute();
}
