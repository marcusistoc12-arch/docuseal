export class HttpError extends Error {
  public readonly status: number;
  public readonly details?: unknown;

  constructor(message: string, status = 500, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export class DocusealApiError extends Error {
  public readonly status: number | undefined;
  public readonly errorCode: string | undefined;
  public readonly details: unknown;

  constructor(message: string, status?: number, errorCode?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
    this.details = details;
  }
}
