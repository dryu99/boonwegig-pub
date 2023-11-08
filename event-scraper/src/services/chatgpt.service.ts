import OpenAI from "openai";
import Cache from "file-system-cache";
import { Config } from "../utils/config";
import { ChatCompletionMessageParam } from "openai/resources/chat";
import { chatGptLogger, logger } from "../utils/logger";
import { InstagramPost } from "./instagram.service";
import {
  MusicEventType,
  ParsedMusicEvent,
} from "../database/models/music-event";
import { callWithTimeout } from "../utils/timeout";

export enum DateTypeResponse {
  SINGLE_DATE_SINGLE_TIME = "1",
  SINGLE_DATE_MANY_TIME = "2",
  SINGLE_DATE_NO_TIME = "3",
  MANY_DATE = "4",
  ELSE = "5",
}

export enum EventTypeResponse {
  CONCERT = "1",
  DJ = "2",
  ART_SHOW = "3",
  ELSE = "4",
}

export class ChatGptService {
  // should prob not be adding static state here lol but since it's a scraper and it just runs once it's prob fine
  public static totalUsageStats = {
    apiRequestCount: 0,
    inputTokens: 0,
    outputTokens: 0,
  };
  private static eventCache = Cache({
    basePath: "./.cache",
    ns: "instagram-post-events", // more like the "parsed-instagram-post" cache
    ttl: 60 * 60 * 24 * 7, // cache for 7 days
  });
  private static readonly MODEL = "gpt-3.5-turbo-1106";
  private static readonly openAi = new OpenAI({
    apiKey: Config.OPENAI_API_KEY,
  });
  private static readonly prompts: {
    dateType: ChatCompletionMessageParam;
    eventType: ChatCompletionMessageParam;
    dataExtraction: ChatCompletionMessageParam;
  } = {
    dateType: {
      role: "system",
      content: `For the given text reply with:
- "1" if a single date and single time are mentioned
- "2" if a single date and multiple times are mentioned
- "3" if a single date and no times are mentioned
- "4" if a multiple dates are mentioned
- "5" if anything else`,
    },
    eventType: {
      role: "user",
      content: `Reply with:
- "1" if the text is advertising a music concert
- "2" if the text is advertising a DJ event
- "3" if the text is advertising an art show
- "4" if anything else`,
    },
    dataExtraction: {
      role: "user",
      content: `Extract the following event data from the post into JSON:  
{
  startDateTime: string; // ISO format
  isFree: boolean;
  artists: string[];
}`,
    },
  };

  // if empty object is returned it implies post was parsed, but it failed a prompt
  public static async parseInstagramEvent(
    post: InstagramPost
  ): Promise<ParsedMusicEvent> {
    logger.info("Extracting event data from post via ChatGPT", {
      postLink: post.link,
    });

    // INITIAL VALIDATION
    if (post.text === undefined || post.text.length === 0) {
      throw new Error("Given post doesn't have any text and can't be parsed");
    }

    const existingEvent = this.eventCache.getSync(post.link);
    if (existingEvent !== undefined) {
      logger.info("Found cached event data, skipping api requests", {
        postLink: post.link,
      });
      return existingEvent;
    }

    // BEGIN PARSING
    const messages: ChatCompletionMessageParam[] = [];

    // "DATE TYPE?" prompt
    messages.push(this.prompts.dateType);
    messages.push({ role: "user", content: post.text });

    // TODO obviously it's not great that we made this mutable, can prob get rid of it with some abstraction but i'm lazy
    let gptRes = await this.promptChatGpt(messages);
    this.printChatGptMessageState("state after: date type?", messages, gptRes);

    const dateTypeRes = this.parseChatGptResponseContent(gptRes, post);

    if (
      dateTypeRes !== DateTypeResponse.SINGLE_DATE_SINGLE_TIME &&
      dateTypeRes !== DateTypeResponse.SINGLE_DATE_MANY_TIME
    ) {
      logger.warn("Invalid date type response", {
        postLink: post.link,
        dateTypeRes,
      });
      const emptyResContent = {};
      this.eventCache.setSync(post.link, emptyResContent);

      // TODO empty event responses implies invalid event, but still some coupling here maybe we can do better
      return emptyResContent;
    }

    messages.push({
      role: "assistant",
      content: dateTypeRes,
    });

    // "EVENT TYPE?" prompt
    messages.push(this.prompts.eventType);
    gptRes = await this.promptChatGpt(messages);
    this.printChatGptMessageState("state after: event type?", messages, gptRes);

    const eventTypeRes = this.parseChatGptResponseContent(gptRes, post);

    if (
      eventTypeRes !== EventTypeResponse.CONCERT &&
      eventTypeRes !== EventTypeResponse.DJ
    ) {
      logger.warn("Invalid event type response", {
        postLink: post.link,
        eventTypeRes,
      });
      const emptyResContent = {};
      this.eventCache.setSync(post.link, emptyResContent);
      return emptyResContent;
    }

    messages.push({
      role: "assistant",
      content: eventTypeRes,
    });

    // "DATA EXTRACTION" prompt
    messages.push(this.prompts.dataExtraction);

    gptRes = await this.promptChatGpt(messages);
    this.printChatGptMessageState(
      "state after: data extraction",
      messages,
      gptRes
    );

    const parsedDataRes = this.parseChatGptResponseContent(gptRes, post);
    const resContent: ParsedMusicEvent = JSON.parse(parsedDataRes);
    resContent.eventType =
      eventTypeRes === EventTypeResponse.CONCERT
        ? MusicEventType.CONCERT
        : MusicEventType.DJ;

    // cache results
    this.eventCache.setSync(post.link, resContent);

    return resContent;
  }

  // Look into seeds: https://cookbook.openai.com/examples/deterministic_outputs_with_the_seed_parameter
  private static async promptChatGpt(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
  ): Promise<OpenAI.Chat.Completions.ChatCompletion> {
    // this request seems to hang sometimes and never return.
    // it's prob due to network issues, not the api itself.
    // but better safe than sorry
    const result = await callWithTimeout(
      this.openAi.chat.completions.create({
        model: this.MODEL,
        messages,
        temperature: 0.5,
        max_tokens: 512, // TODO investigate this param
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
      30 * 1000
    );

    this.totalUsageStats.apiRequestCount++;
    this.totalUsageStats.inputTokens += result.usage?.prompt_tokens ?? 0;
    this.totalUsageStats.outputTokens += result.usage?.completion_tokens ?? 0;

    return result;
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

    logger.info(logMessage, {
      allMessages,
      systemFingerprint: gptRes.system_fingerprint,
    });
  }
}
