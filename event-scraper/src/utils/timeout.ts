export const timeout = (ms: number): Promise<never> =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), ms)
  );

export const callWithTimeout = async <T>(
  promise: Promise<T>,
  ms: number
): Promise<T> => {
  return Promise.race([promise, timeout(ms)]);
};
