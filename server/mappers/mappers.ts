import {
  Poll,
  Option,
  User,
  Vote,
  UserRow,
  VoteRow,
  PollRow,
  OptionRow,
} from "../types/exceptionType.ts";

// ---------- API: Poll Management -----------------------

export function pollRowToApi(row: PollRow, optionRows: OptionRow[] = []): Poll {
  return {
    pollId: row.poll_id,
    title: row.title,
    description: row.description ?? undefined,
    creationDate: row.creation_date,
    expirationDate: row.expiration_date ?? undefined,
    status: row.status,
    userId: row.user_id,
    options: optionRows.map((opt) => optionRowToApi(opt)),
  };
}

// ---------- API: Poll Results --------------------------

export function optionRowToApi(row: OptionRow): Option {
  return {
    optionId: row.option_id,
    descriptiveText: row.descriptive_text ?? undefined,
    creationDate: row.creation_date,
    voteCount: row.vote_count ?? undefined,
    pollId: row.poll_id ?? undefined,
  };
}

// ---------- API: User --------------------------

export function userRowToApi(row: UserRow): User {
  return {
    userId: row.user_id,
    name: row.name,
    lastName: row.last_name,
    password: row.password,
    email: row.email,
    role: row.role,
  };
}

// ---------- API: Vote --------------------------

export function voteRowToApi(row: VoteRow): Vote {
  return {
    voteId: row.vote_id,
    creationDate: row.creation_date,
    userId: row.user_id,
    optionId: row.option_id,
  };
}
