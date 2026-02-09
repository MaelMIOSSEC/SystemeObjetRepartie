import { SQLOutputValue } from "node:sqlite";

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