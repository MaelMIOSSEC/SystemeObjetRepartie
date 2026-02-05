import { Application } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import pollsRouter from "./routes/polls.ts";
import {
  Poll,
  PollRow,
  Option,
  OptionRow,
  User,
  UserRow,
  Vote,
  VoteRow,
} from "./types.ts";
import { SQLOutputValue } from "node:sqlite";

// ---------- Database -----------------------------------

// ---------- HTTP Router --------------------------------

// ---------- WebSocket Management -----------------------

const clients = new Set<WebSocket>();

// ---------- API: Poll Management -----------------------

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

export function voteRowToApi(row: VoteRow): Vote {
  return {
    voteId: row.vote_id,
    creationDate: row.creation_date,
    userId: row.user_id,
    optionId: row.option_id,
  };
}

// ---------- Application --------------------------------

const PROTOCOL = "http";
const HOSTNAME = "localhost";
const PORT = 8000;
const ADDRESS = `${PROTOCOL}://${HOSTNAME}:${PORT}`;

const app = new Application();

app.use(oakCors());
app.use(pollsRouter.routes());
app.use(pollsRouter.allowedMethods());

app.addEventListener("listen", () =>
  console.log(`Server listening on ${ADDRESS}`)
);

if (import.meta.main) {
  await app.listen({ hostname: HOSTNAME, port: PORT });
}

export { app };
