import { DatabaseManager } from "./database/db-manager";
import { Server } from "./server";
import { ErrorUtils } from "./utils/error";
import { logger } from "./utils/logger";

const main = async () => {
  try {
    // DB starts automatically
    await Server.run();
  } catch (error: any) {
    logger.error("Something went wrong during scraper run", {
      error: ErrorUtils.toObject(error),
    });
  } finally {
    await DatabaseManager.stop();
    logger.info("Finished running scraper!");
    process.exit();
  }
};

main();
