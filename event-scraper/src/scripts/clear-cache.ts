import { ChatGptService } from "../services/chatgpt.service";
import { InstagramService } from "../services/instagram.service";

const main = async () => {
  const args = process.argv.slice(2);
  const cacheName = args[0];

  console.log("Clearing cache...", { cacheName });

  if (cacheName === "posts") {
    await ChatGptService.parsedPostCache.clear();
  } else if (cacheName === "users") {
    InstagramService.scrapedUserCache.clear();
  } else {
    console.error("Cache name not recognized");
    process.exit(1);
  }

  console.log("Done!");
  process.exit();
};

main();
