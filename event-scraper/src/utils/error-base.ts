export class ErrorBase<T extends string> extends Error {
  name: T;
  message: string;
  metadata: any;

  constructor({
    name,
    message,
    metadata,
  }: {
    name: T;
    message: string;
    metadata?: any;
  }) {
    super();
    this.name = name;
    this.message = message;
    this.metadata = metadata;
  }
}
