import { DatabaseManager } from "./database/db-manager";
import { Server } from "./server";
import { logger } from "./utils/logger";

const main = async () => {
  try {
    // DB starts automatically
    await Server.run();
  } catch (err) {
    console.log(err); // TODO replace with logger
  } finally {
    await DatabaseManager.stop();
    logger.info("Finished running scraper!");
    process.exit();
  }
};

main();
