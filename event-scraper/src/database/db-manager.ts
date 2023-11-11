import { Client, Pool, Submittable } from "pg";
import { Config } from "../utils/config"; // Assuming you have a configuration file or use environment variables
import { logger } from "../utils/logger";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { DB } from "./db-schemas";

export class DatabaseManager {
  private static pool: Pool;
  private static dialect: PostgresDialect;
  public static db: Kysely<DB>;

  public static start() {
    logger.info(`Connecting to database...`, {
      host: Config.DATABASE_HOST,
      port: Number(Config.DATABASE_PORT),
      user: Config.DATABASE_USER,
      database: Config.DATABASE_NAME,
    });

    this.pool = new Pool({
      host: Config.DATABASE_HOST,
      port: Number(Config.DATABASE_PORT),
      user: Config.DATABASE_USER,
      password: Config.DATABASE_PASSWORD,
      database: Config.DATABASE_NAME,
      max: 10,
    });
    this.dialect = new PostgresDialect({
      pool: this.pool,
    });
    this.db = new Kysely<DB>({
      dialect: this.dialect,
      plugins: [new CamelCasePlugin()],
    });
  }

  public static stop() {
    return this.db
      .destroy()
      .then(() => logger.info(`Disconnected from database`));
  }
}
