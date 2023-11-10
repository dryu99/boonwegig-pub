import { ChatGptService } from "../services/chatgpt.service";
import { InstagramService } from "../services/instagram.service";

const main = async () => {
  console.log("Clearing cache...");
  // uncomment whichever cache you want to clear, maybe we can automate later

  await ChatGptService.parsedPostCache.clear();
  // InstagramService.scrapedUserCache.clear();
};

main();
