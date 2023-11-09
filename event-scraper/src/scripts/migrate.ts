import { fs } from "file-system-cache/lib/common";
import { Migrator, FileMigrationProvider } from "kysely";
import { run } from "kysely-migration-cli";
import path from "path";
import { DatabaseManager } from "../database/db-manager";

const db = DatabaseManager.db;

const migrator = new Migrator({
  db: DatabaseManager.db,
  provider: new FileMigrationProvider({
    fs,
    path,
    // This needs to be an absolute path.
    migrationFolder: path.join(__dirname, "../database/migrations"),
  }),
});

run(db, migrator, path.join(__dirname, "../database/migrations"));

console.log(
  "REMINDER: Remember to regenerate db schema if you ran any migrations!"
);
