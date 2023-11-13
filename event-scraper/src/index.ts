import { DatabaseManager } from "./database/db-manager";
import { Server } from "./server";
import ErrorTrackerService from "./services/error-tracker.service";
import { logger, waitForLoggerToComplete } from "./utils/logger";

const main = async () => {
  try {
    DatabaseManager.start();
    await Server.run();
  } catch (error: any) {
    logger.error("Scraper run failed", { error: error.message });
    ErrorTrackerService.captureException(error);
  } finally {
    logger.info("Shutting down dependencies...");
    await DatabaseManager.stop();
    await ErrorTrackerService.stop(2000);
    await waitForLoggerToComplete(logger);
    logger.info("Finished running scraper!");
    process.exit();
  }
};

main();
