import OpenAI from "openai";
import { Config } from "../utils/config";
import { ChatCompletionMessageParam } from "openai/resources/chat";
import { chatGptLogger, logger } from "../utils/logger";
import { InstagramPost } from "./instagram.service";
import { ParsedMusicEvent } from "../db/models/event";

type ResponseContent = {
  event: ParsedMusicEvent | null;
};

const prompts: string[] = [
  // 1. system message
  // prune right away
  `For the following Instagram post:
- Reply with 1 if advertising a SINGLE event
- Reply with 2 if advertising MULTIPLE events
- Reply with 3 if not advertising anything`,

  // 2. single event path
  // prune right away
  `- Reply with 1 if music related
- Reply with 2 if art related
- Reply with 3 if other`,

  // 3. music path
  // prune right away
  `- Reply with 1 if classical concert
- Reply with 2 if DJ set
- Reply with 3 if any other concert`,

  // 4. data extraction path
  `Extract the following event data from the post into JSON:

{
  openDateTime?: string; // ISO
  startDateTime?: string; // ISO
  earlyPrice?: number;
  doorPrice?: number; // -1 if donation
  artists?: string[];
}`,
];

// ~100 tokens
const systemMessage: ChatCompletionMessageParam = {
  role: "system",
  content: `Extract Instagram post data for underground music event into JSON:

{
  event?: {
    openDateTime?: string; // ISO
    startDateTime?: string; // ISO
    earlyPrice?: number;
    doorPrice?: number; // -1 if donation
    eventType?: "concert" | "dj";
    artists?: string[];
  }
}

Strict guidelines when extracting data:
- Don't prettify the JSON
- Multiple events or no promotions in a post: set event to null`,
};

export class ChatGptService {
  private static openAi = new OpenAI({
    apiKey: Config.OPENAI_API_KEY,
  });

  // TODO theres definitely a way to optimize this so i don't have to send same system message on every request. we can reuse it somehow
  public static async extractInstagramPostEventData(
    post: InstagramPost
  ): Promise<ParsedMusicEvent | null> {
    const res = await this.openAi.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemMessage, { role: "user", content: post.text }],
      temperature: 0.5,
      max_tokens: 512, // TODO investigate this param
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    chatGptLogger.info(`Usage: ${res.id}`, {
      postLink: post.link,
      usage: res.usage,
    });

    if (res.choices.length === 0) {
      throw new Error("ChatGPT API returned 0 choices: " + post.link);
    }

    if (res.choices.length > 1)
      logger.warning("ChatGPT API returned multiple choices", {
        choices: res.choices,
        postLink: post.link,
      });

    const resContentStr = res.choices[0].message.content;
    if (resContentStr === null) {
      throw new Error(
        "ChatGPT API returned message content is missing: " + post.link
      );
    }

    const resContent: ResponseContent = JSON.parse(resContentStr);
    return resContent.event;
  }
}
