import { Config } from "./config";

const toObject = (
  error: Error,
  includeStack: boolean = false
): Record<string, string | undefined> => {
  const errorData: Record<string, string | undefined> = {};
  Object.getOwnPropertyNames(error).forEach((key) => {
    errorData[key] = (error as any)[key];
  });

  errorData.stack =
    (includeStack && error.stack) || Config.NODE_ENV === "development"
      ? error.stack
      : undefined;
  return errorData;
};

export const ErrorUtils = {
  toObject,
};
