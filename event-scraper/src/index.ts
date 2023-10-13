import { DatabaseManager } from "./database/db-manager";
import { Server } from "./server";
import { logger } from "./utils/logger";

const main = async () => {
  try {
    // DB starts automatically
    // await Server.start();
  } catch (err) {
    console.log(err); // TODO replace with logger
  } finally {
    await DatabaseManager.stop();
  }
};

main();
