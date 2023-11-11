// You can also use CommonJS `require('@sentry/node')` instead of `import`
import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";
import { Config } from "../utils/config";
import { AppError } from "../utils/error";

Sentry.init({
  dsn: Config.SENTRY_DSN,
  environment: Config.NODE_ENV,
  integrations: [new ProfilingIntegration()],
  // Performance Monitoring
  tracesSampleRate: 1.0,
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

export default class ErrorTrackerService {
  public static captureException(error: any, extraData?: Record<string, any>) {
    Sentry.captureException(error, {
      extra: {
        // capture extra metadata provided by AppError
        appErrorData: error instanceof AppError ? error.data : undefined,
        captureData: extraData,
      },
    });
  }

  public static captureMessage(
    message: string,
    extraData?: Record<string, any>
  ) {
    Sentry.captureMessage(message, { extra: extraData });
  }

  public static async stop(ms: number) {
    return Sentry.close(ms);
  }
}
