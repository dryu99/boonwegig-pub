import dotenv from "dotenv";
import { ensure } from "./null";
import path from "path";

let envPath: string | undefined;
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  envPath = path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`);
} else if (process.env.NODE_ENV === "production") {
  // one level up from dist/ folder
  envPath = path.resolve(__dirname, `../../../.env.${process.env.NODE_ENV}`);
} else {
  throw new Error("NODE_ENV environment variable not set");
}

dotenv.config({
  path: envPath,
});

export const Config = Object.freeze({
  NODE_ENV: process.env.NODE_ENV as "development" | "production" | "test",
  OPENAI_API_KEY: ensure(process.env.OPENAI_API_KEY),
  DATABASE_HOST: ensure(process.env.DATABASE_HOST),
  DATABASE_PORT: ensure(process.env.DATABASE_PORT),
  DATABASE_USER: ensure(process.env.DATABASE_USER),
  DATABASE_PASSWORD: ensure(process.env.DATABASE_PASSWORD),
  DATABASE_NAME: ensure(process.env.DATABASE_NAME),

  SENTRY_DSN: ensure(process.env.SENTRY_DSN),
  SCRAPING_FISH_API_KEY: ensure(process.env.SCRAPING_FISH_API_KEY),
});

export const resolveByEnv = <T>({ dev, prod }: { dev: T; prod: T }) => {
  return process.env.NODE_ENV === "production" ? prod : dev;
};
