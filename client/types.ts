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

export function isPollRow(obj: Record<string, SQLOutputValue>): obj is PollRow {
  return (
    "poll_id" in obj &&
    typeof obj.poll_id === "string" &&
    "title" in obj &&
    typeof obj.title === "string" &&
    "description" in obj &&
    (typeof obj.description === "string" || obj.description === null) &&
    "creation_date" in obj &&
    typeof obj.creation_date === "string" &&
    "expiration_date" in obj &&
    (typeof obj.expiration_date === "string" || obj.expiration_date === null) &&
    "status" in obj &&
    typeof obj.status === "string" &&
    "user_id" in obj &&
    typeof obj.user_id == "string" &&
    "superpoll_id" in obj &&
    typeof obj.superpoll_id === "string"
  );
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

export function isOptionRow(
  obj: Record<string | number, SQLOutputValue>
): obj is OptionRow {
  return (
    "option_id" in obj &&
    typeof obj.option_id === "string" &&
    "descriptive_text" in obj &&
    (typeof obj.descriptive_text === "string" ||
      obj.descriptive_text === null) &&
    "creation_date" in obj &&
    typeof obj.creation_date === "string" &&
    "vote_count" in obj &&
    (typeof obj.vote_count === "number" || obj.vote_count === null) &&
    "poll_id" in obj &&
    typeof obj.poll_id === "string"
  );
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

export function isUserRow(obj: Record<string, SQLOutputValue>): obj is UserRow {
  return (
    "user_id" in obj &&
    typeof obj.user_id === "string" &&
    "name" in obj &&
    obj.name === "string" &&
    "last_name" in obj &&
    obj.last_name === "string" &&
    "password" in obj &&
    obj.password === "string" &&
    "email" in obj &&
    obj.email === "string" &&
    "role" in obj &&
    obj.role === "string"
  );
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

export function isVoteRow(obj: Record<string, SQLOutputValue>): obj is VoteRow {
  return (
    "vote_id" in obj &&
    typeof obj.vote_id === "string" &&
    "creation_date" in obj &&
    typeof obj.creation_date === "string" &&
    "user_id" in obj &&
    typeof obj.user_id === "string" &&
    "option_id" in obj &&
    typeof obj.option_id === "string"
  );
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
