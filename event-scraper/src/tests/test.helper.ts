import { Migrator, NO_MIGRATIONS } from "kysely";

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
