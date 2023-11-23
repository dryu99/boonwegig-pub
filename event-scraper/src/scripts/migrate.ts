import { fs } from "file-system-cache/lib/common";
import { Migrator, FileMigrationProvider } from "kysely";
import { run } from "kysely-migration-cli";
import path from "path";
import { DatabaseManager } from "../database/db-manager";

DatabaseManager.start();
const db = DatabaseManager.db;

const migrator = DatabaseManager.getMigrator(
  path.join(__dirname, "../database/migrations")
);

run(db, migrator, path.join(__dirname, "../database/migrations"));
console.log(
  "> REMINDER: Remember to regenerate db types if you ran any migrations!!!"
);
