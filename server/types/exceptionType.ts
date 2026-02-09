export enum ApiErrorCode {
  TIMEOUT = "TIMEOUT",
  NOT_FOUND = "NOT_FOUND",
  BAD_REQUEST = "BAD_REQUEST",
  SERVER_ERROR = "SERVER_ERROR",
}

export interface ApiError {
  code: ApiErrorCode;
  message: string;
}

interface ApiSuccess<T> {
  success: true;
  error?: never;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: ApiError;
  data?: never;
}

export class APIException extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;

  constructor(code: ApiErrorCode, status: number, message: string) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;