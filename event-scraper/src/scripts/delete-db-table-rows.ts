import { DatabaseManager } from "../database/db-manager";
import { Config } from "../utils/config";

const main = async () => {
  if (Config.NODE_ENV !== "development") {
    console.error("This script should only be run in development mode");
    process.exit(1);
  }

  DatabaseManager.start();

  const args = process.argv.slice(2);
  const tableName = args[0];

  console.log("Deleting table rows...", { tableName });
  await DatabaseManager.db.deleteFrom(tableName as any).execute();
  console.log("Done!");
  process.exit();
};

main();
