import { Client, Pool, Submittable } from "pg";
import { Config } from "../utils/config"; // Assuming you have a configuration file or use environment variables
import { logger } from "../utils/logger";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { DB } from "./db";

logger.info(`Connecting to database...`);
export class DatabaseManager {
  private static pool = new Pool({
    host: Config.DATABASE_HOST,
    port: Number(Config.DATABASE_PORT),
    user: Config.DATABASE_USER,
    password: Config.DATABASE_PASSWORD,
    database: Config.DATABASE_NAME,
    max: 10,
  });
  private static dialect = new PostgresDialect({
    pool: this.pool,
  });
  public static db = new Kysely<DB>({
    dialect: this.dialect,
    plugins: [new CamelCasePlugin()],
  });

  public static stop() {
    return this.db
      .destroy()
      .then(() => logger.info(`Disconnected from database`));
  }
}
