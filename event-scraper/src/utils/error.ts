const toObject = (
  error: Error,
  includeStack: boolean = true
): Record<string, string> => {
  const errorData: Record<string, string> = {};
  Object.getOwnPropertyNames(error).forEach((key) => {
    errorData[key] = (error as any)[key];
  });
  if (includeStack && error.stack) {
    errorData.stack = error.stack;
  }
  return errorData;
};

export const ErrorUtils = {
  toObject,
};
