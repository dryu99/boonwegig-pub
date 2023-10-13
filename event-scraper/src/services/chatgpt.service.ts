import OpenAI from "openai";
import { Config } from "../utils/config";
import { ChatCompletionMessageParam } from "openai/resources/chat";
import { chatGptLogger, logger } from "../utils/logger";
import { InstagramPost } from "./instagram.service";
import { ParsedMusicEvent } from "../db/models/event";

export enum HowManyEventsResponse {
  SINGLE = "1",
  MULTIPLE = "2",
  OTHER = "3",
}
export enum EventTypeResponse {
  MUSIC = "1",
  ART = "2",
  OTHER = "3",
}
export enum MusicEventTypeResponse {
  CLASSICAL = "1",
  DJ = "2",
  OTHER = "3",
}

export class ChatGptService {
  private static readonly MODEL = "gpt-3.5-turbo";
  private static readonly openAi = new OpenAI({
    apiKey: Config.OPENAI_API_KEY,
  });
  private static readonly prompts: {
    howManyEventsPrompt: ChatCompletionMessageParam;
    // eventTypePrompt: ChatCompletionMessageParam;
    musicEventTypePrompt: ChatCompletionMessageParam;
    dataExtractionPrompt: ChatCompletionMessageParam;
  } = {
    howManyEventsPrompt: {
      role: "system",
      content: `For the following Instagram post:
    - Reply with 1 if advertising a SINGLE MUSIC event
    - Reply with 2 if advertising MULTIPLE events
    - Reply with 3 if not advertising anything`,
    },
    // eventTypePrompt: {
    //   role: "user",
    //   content: `- Reply with 1 if music related
    // - Reply with 2 if art related
    // - Reply with 3 if other`,
    // },
    musicEventTypePrompt: {
      role: "user",
      content: `- Reply with 1 if classical concert
    - Reply with 2 if DJ set
    - Reply with 3 if any other concert`,
    },
    dataExtractionPrompt: {
      role: "user",
      content: `Extract the following event data from the post into JSON:
  
    {
      openDateTime?: string; // ISO
      startDateTime?: string; // ISO
      earlyPrice?: number;
      doorPrice?: number; // -1 if donation
      artists?: string[];
    }`,
    },
  };

  // TODO theres definitely a way to optimize this so i don't have to send same system message on every request. we can reuse it somehow
  public static async extractInstagramPostEventData(
    post: InstagramPost
  ): Promise<ParsedMusicEvent | null> {
    logger.info("Extracting event data from post", { postLink: post.link });

    // "HOW MANY EVENTS?" prompt
    const messages: ChatCompletionMessageParam[] = [
      this.prompts.howManyEventsPrompt,
      { role: "user", content: post.text },
    ];
    let gptRes = await this.promptChatGpt(messages);
    this.printChatGptMessageState(
      "state after: how many events",
      messages,
      gptRes
    );

    const howManyEventsRes = this.parseChatGptResponseContent(gptRes, post);

    // invalid event count
    if (howManyEventsRes !== HowManyEventsResponse.SINGLE) return null;

    // "MUSIC EVENT TYPE?" prompt
    this.pruneMessage(messages, this.prompts.howManyEventsPrompt.content);
    messages.push(this.prompts.musicEventTypePrompt);

    gptRes = await this.promptChatGpt(messages);
    this.printChatGptMessageState(
      "state after: music event type",
      messages,
      gptRes
    );

    const musicEventTypeRes = this.parseChatGptResponseContent(gptRes, post);

    // invalid music event type
    if (musicEventTypeRes !== EventTypeResponse.OTHER) return null;

    // "EXTRACT DATA" prompt
    this.pruneMessage(messages, this.prompts.musicEventTypePrompt.content);
    messages.push(this.prompts.dataExtractionPrompt);

    gptRes = await this.promptChatGpt(messages);
    this.printChatGptMessageState(
      "state after: data extraction",
      messages,
      gptRes
    );

    const parsedDataRes = this.parseChatGptResponseContent(gptRes, post);

    const resContent: ParsedMusicEvent = JSON.parse(parsedDataRes);
    return resContent;
  }

  private static async promptChatGpt(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
  ): Promise<OpenAI.Chat.Completions.ChatCompletion> {
    return this.openAi.chat.completions.create({
      model: this.MODEL,
      messages,
      temperature: 0.5,
      max_tokens: 512, // TODO investigate this param
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
  }

  private static parseChatGptResponseContent(
    res: OpenAI.Chat.Completions.ChatCompletion,
    post: InstagramPost
  ): string {
    chatGptLogger.info(`ChatGPT API request info`, {
      postLink: post.link,
      model: this.MODEL,
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

    return resContentStr;
  }

  private static pruneMessage(
    messages: ChatCompletionMessageParam[],
    messageToPrune: string | null
  ): void {
    if (messageToPrune === null) {
      throw new Error(`Tried to prune message but it's null`);
    }

    const messageIndex = messages.findIndex(
      (message) => message.content === messageToPrune
    );

    if (messageIndex === -1) {
      throw new Error(
        `Message ${messageToPrune} not found in messages: ${JSON.stringify(
          messages
        )}`
      );
    }

    messages.splice(messageIndex, 1);
  }

  private static printChatGptMessageState(
    logMessage: string,
    sentMessages: ChatCompletionMessageParam[],
    gptRes: OpenAI.Chat.Completions.ChatCompletion
  ) {
    const allMessages = sentMessages
      .map((m) => m.content)
      .concat(gptRes.choices.map((c) => c.message.content))
      .map((str) => str?.slice(0, 50));

    logger.info(logMessage, { allMessages });
  }
}
