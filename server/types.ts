import { SQLOutputValue } from "node:sqlite";

// ---------- API: Poll Management -----------------------

export interface Poll {
  pollId: string;
  title: string;
  description?: string;
  creationDate: string;
  expirationDate?: string;
  status: string;
  userId?: string;
  // superpollId: Superpoll;
  options: Option[];
}

export interface PollRow {
  poll_id: string;
  title: string;
  description: string;
  creation_date: string;
  expiration_date: string;
  status: string;
  user_id: string;
  superpoll_id: string;
  [key: string]: SQLOutputValue;
}

// ---------- API: Option --------------------------

export interface Option {
  optionId: string;
  descriptiveText?: string;
  creationDate: string;
  voteCount?: number;
  pollId?: string;
}

export interface OptionRow {
  option_id: string;
  descriptive_text: string;
  creation_date: string;
  vote_count: number;
  poll_id: string;
  [key: string]: SQLOutputValue;
}

// ---------- API: Authentication / Users ----------------

export interface User {
  userId: string;
  name: string;
  lastName: string;
  password: string;
  email: string;
  role: string;
}

export interface UserRow {
  user_id: string;
  name: string;
  last_name: string;
  password: string;
  email: string;
  role: string;
  [key: string]: SQLOutputValue;
}

// ---------- API: Voting --------------------------------

export interface Vote {
  voteId: string;
  creationDate: string;
  userId: string;
  optionId: string;
}

export interface VoteRow {
  vote_id: string;
  creation_date: string;
  user_id: string;
  option_id: string;
  [key: string]: SQLOutputValue;
}

// ---------- API: Response ------------------------------

export enum ApiErrorCode {
  TIMEOUT = "TIMEOUT",
  NOT_FOUND = "NOT_FOUND",
  BAD_REQUEST = "BAD_REQUEST",
  SERVER_ERROR = "SERVER_ERROR",
}

interface ApiError {
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
