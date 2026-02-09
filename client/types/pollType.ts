import { SQLOutputValue } from "node:sqlite";

import type { Option } from "../types/optionType";

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