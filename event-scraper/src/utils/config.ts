import dotenv from "dotenv";

dotenv.config();

// dotenv.config({
//   path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`),
// });

export const Config = Object.freeze({
  NODE_ENV: process.env.NODE_ENV as string,
  INSTAGRAM_COOKIE: process.env.INSTAGRAM_COOKIE as string,
  INSTAGRAM_USER_AGENT: process.env.INSTAGRAM_USER_AGENT as string,
  INSTAGRAM_X_IG_APP_ID: process.env.INSTAGRAM_X_IG_APP_ID as string,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
  DATABASE_HOST: process.env.DATABASE_HOST as string,
  DATABASE_PORT: process.env.DATABASE_PORT as string,
  DATABASE_USER: process.env.DATABASE_USER as string,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD as string,
  DATABASE_NAME: process.env.DATABASE_NAME as string,
  VITE_SPOTIFY_CLIENT_SECRET: process.env.VITE_SPOTIFY_CLIENT_SECRET as string,
  VITE_SPOTIFY_CLIENT_ID: process.env.VITE_SPOTIFY_CLIENT_ID as string,
  VITE_REDIRECT_TARGET: process.env.VITE_REDIRECT_TARGET as string,
});
