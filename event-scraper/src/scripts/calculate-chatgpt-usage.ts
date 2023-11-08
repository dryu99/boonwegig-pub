import fs from "fs";
import OpenAI from "openai";
import path from "path";
import readline from "readline";
import { logger } from "../utils/logger";

const GPT3_INPUT_COST_PER_1K_TOKENS = 0.001;
const GPT3_OUTPUT_COST_PER_1K_TOKENS = 0.002;

const main = async () => {
  const logPath = path.resolve(__dirname, `../../logs/chatgpt.development.log`);

  const fileStream = fs.createReadStream(logPath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // so that it handles all instances of CR LF ('\r\n') as a single line break
  });

  const usages: OpenAI.Completions.CompletionUsage[] = [];

  let i = 0;
  for await (const line of rl) {
    try {
      const log = JSON.parse(line);
      usages.push(log.usage);
    } catch (err) {
      console.error("Error parsing line:", { line, err, i });
    } finally {
      i++;
    }
  }

  // const costs = usages.map((usage) => {
  //   const inputTokensCost =
  //     (usage.prompt_tokens / 1000) * GPT3_INPUT_COST_PER_1K_TOKENS;
  //   const outputTokensCost =
  //     (usage.completion_tokens / 1000) * GPT3_OUTPUT_COST_PER_1K_TOKENS;

  //   return inputTokensCost + outputTokensCost;
  // });

  const inputTokenCost = usages.reduce(
    (prevSum, currUsage) =>
      prevSum +
      (currUsage.prompt_tokens / 1000) * GPT3_INPUT_COST_PER_1K_TOKENS,
    0
  );

  const totalInputTokens = usages.reduce(
    (prevSum, currUsage) => prevSum + currUsage.prompt_tokens,
    0
  );

  const outputTokenCost = usages.reduce(
    (prevSum, currUsage) =>
      prevSum +
      (currUsage.completion_tokens / 1000) * GPT3_OUTPUT_COST_PER_1K_TOKENS,
    0
  );

  const totalOutputTokens = usages.reduce(
    (prevSum, currUsage) => prevSum + currUsage.completion_tokens,
    0
  );

  logger.info("Current ChatGPT usage data", {
    apiRequestCount: usages.length,
    inputData: {
      totalTokens: totalInputTokens,
      totalCost: "$" + inputTokenCost.toFixed(2),
    },
    outputData: {
      totalTokens: totalOutputTokens,
      totalCost: "$" + outputTokenCost.toFixed(2),
    },
  });
};

main();
