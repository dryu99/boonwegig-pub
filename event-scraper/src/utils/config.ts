import dotenv from "dotenv";
import { ensure } from "./nullable";

dotenv.config();

// dotenv.config({
//   path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`),
// });

export const Config = Object.freeze({
  NODE_ENV: ensure(process.env.NODE_ENV),
  INSTAGRAM_COOKIE: ensure(process.env.INSTAGRAM_COOKIE),
  INSTAGRAM_USER_AGENT: ensure(process.env.INSTAGRAM_USER_AGENT),
  INSTAGRAM_X_IG_APP_ID: ensure(process.env.INSTAGRAM_X_IG_APP_ID),
  OPENAI_API_KEY: ensure(process.env.OPENAI_API_KEY),
  DATABASE_HOST: ensure(process.env.DATABASE_HOST),
  DATABASE_PORT: ensure(process.env.DATABASE_PORT),
  DATABASE_USER: ensure(process.env.DATABASE_USER),
  DATABASE_PASSWORD: ensure(process.env.DATABASE_PASSWORD),
  DATABASE_NAME: ensure(process.env.DATABASE_NAME),
  VITE_SPOTIFY_CLIENT_SECRET: ensure(process.env.VITE_SPOTIFY_CLIENT_SECRET),
  VITE_SPOTIFY_CLIENT_ID: ensure(process.env.VITE_SPOTIFY_CLIENT_ID),
  VITE_REDIRECT_TARGET: ensure(process.env.VITE_REDIRECT_TARGET),
  WEB_SCRAPING_API_KEYS: [
    ensure(process.env.WEB_SCRAPING_AI_API_KEY_1),
    ensure(process.env.WEB_SCRAPING_AI_API_KEY_2),
  ],
});
