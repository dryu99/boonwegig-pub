import { Kysely, Migrator, NO_MIGRATIONS } from "kysely";
import { DB } from "../database/db-schemas";

export async function resetDbTables(db: Kysely<DB>) {
  // delete in order of fk dependencies
  return db.transaction().execute(async (trx) => {
    await trx.deleteFrom("musicEventArtists").execute();
    await trx.deleteFrom("musicEvent").execute();
    await trx.deleteFrom("musicArtist").execute();
    await trx.deleteFrom("venue").execute();
  });
}

export async function migrateDown(migrator: Migrator) {
  const { error, results } = await migrator.migrateTo(NO_MIGRATIONS);
  error && console.error("migration-down for test db failed", error);
  // results && results.forEach((result) => console.log(result));
}

export async function migrateLatest(migrator: Migrator) {
  const { error, results } = await migrator.migrateToLatest();
  error && console.error("migration-latest for test db failed", error);
  // results && results.forEach((result) => console.log(result));
}
