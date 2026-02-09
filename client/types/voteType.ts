import { SQLOutputValue } from "node:sqlite";

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