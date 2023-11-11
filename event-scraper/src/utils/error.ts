export class AppError extends Error {
  public data?: Record<string, any>;
  public options: {
    capture: boolean; // determines if this error should be logged in an external tracking service
  };

  constructor(
    message: string,
    data?: Record<string, any>,
    options = { capture: true }
  ) {
    super(message);
    this.data = data;
    this.options = options;
  }
}
