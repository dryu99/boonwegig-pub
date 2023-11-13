import winston from "winston";
import { Config } from "./config";

// TODO would be nice to make this file a class but w/e

const createLogger = (filename: string) => {
  const logger = winston.createLogger({
    transports: [
      new winston.transports.File({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
        filename,
        // maxFiles: "14d",
      }),
    ],
  });

  // only log to console in development
  if (Config.NODE_ENV !== "production") {
    logger.add(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf((info) => {
            const { timestamp, level, message, ...args } = info;

            const ts = timestamp.slice(0, 19).replace("T", " ");
            return `${ts} [${level}]: ${message} ${
              Object.keys(args).length ? JSON.stringify(args, null, 2) : ""
            }`;
          })
        ),
      })
    );
  }

  return logger;
};

export const logger = createLogger(`../../logs/${Config.NODE_ENV}.log`);

// we use this logger to aggregate chatgpt usage in a separate file.
// basically i was too lazy to create my own file writing module lol
export const chatGptLogger = createLogger(
  `../../logs/chatgpt.${Config.NODE_ENV}.log`
);

export const taggedLogger = (loggerName: string) => {
  return {
    debug(message: string, ...meta: any[]) {
      logger.debug(`[${loggerName}] ${message}`, ...meta);
    },
    error(message: string, ...meta: any[]) {
      logger.error(`[${loggerName}] ${message}`, ...meta);
    },
    info(message: string, ...meta: any[]) {
      logger.info(`[${loggerName}] ${message}`, ...meta);
    },
    warn(message: string, ...meta: any[]) {
      logger.warn(`[${loggerName}] ${message}`, ...meta);
    },
  };
};

export const waitForLoggerToComplete = (logger: winston.Logger) => {
  return new Promise((resolve) => {
    logger.on("finish", resolve);
  });
};
