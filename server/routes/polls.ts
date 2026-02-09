import { Router, context } from "@oak/oak";
import { DatabaseSync } from "node:sqlite";
import {
  ApiResponse,
  ApiErrorCode,
  APIException,
} from "../types/exceptionType.ts";
import { Poll, isPollRow } from "../types/pollType.ts";
import { isOptionRow } from "../types/optionType.ts";
import { errorMiddleware, entropyMiddleware } from "../middlewares/middlewareError.ts";
import { pollRowToApi } from "../mappers/mappers.ts";

// const db = new Database("polls.db");
const db = new DatabaseSync("polls.db");

const router = new Router({ prefix: "/polls" });

// Obtenir la liste des sondages
router.get("/", errorMiddleware, entropyMiddleware, (ctx: context) => {
  const pollRows = db
    .prepare(
      `SELECT poll_id, title, description, creation_date, expiration_date, status, user_id, superpoll_id
       FROM polls;`,
    )
    .all();

  if (!pollRows) {
    throw new APIException(ApiErrorCode.NOT_FOUND, 404, "Polls not founds");
  }

  const pollsApi: Poll[] = [];

  for (const row of pollRows) {
    if (!isPollRow(row)) {
      console.warn("Ligne de sondage invalide ignorée", row);
      continue;
    }

    const optionRows = db
      .prepare(
        `SELECT option_id, descriptive_text, creation_date, vote_count, poll_id 
         FROM options 
         WHERE poll_id = ?;`,
      )
      .all(row.poll_id);

    const validOptions = optionRows.filter(isOptionRow);

    const pollApi = pollRowToApi(row, validOptions);

    pollsApi.push(pollApi);
  }

  ctx.response.status = 200;
  ctx.response.body = {
    success: true,
    data: pollsApi,
  };
});

// Obtenir un sondage unique
router.get("/:pollId", errorMiddleware, entropyMiddleware , (ctx: context) => {
  const pollId = ctx.params.pollId;

  if (!pollId) {
    throw new APIException(ApiErrorCode.NOT_FOUND, 404, "Poll not found");
  }

  const pollRow = db
    .prepare(
      `SELECT poll_id, title, description, creation_date, expiration_date, status, user_id, superpoll_id
    FROM polls WHERE poll_id = ?;`,
    )
    .get(pollId);

  if (!pollRow || !isPollRow(pollRow)) {
    const response: ApiResponse<Poll> = {
      success: false,
      error: { code: ApiErrorCode.NOT_FOUND, message: "poll not found." },
    };

    ctx.response.status = 404;
    ctx.response.body = response;

    return;
  }

  const optionRows = db
    .prepare(
      `SELECT option_id, descriptive_text, creation_date, vote_count, poll_id FROM options WHERE poll_id = ?;`,
    )
    .all(pollId);

  if (
    !Array.isArray(optionRows) ||
    !optionRows.every((row) => isOptionRow(row as any))
  ) {
    const response: ApiResponse<Poll> = {
      success: false,
      error: { code: ApiErrorCode.NOT_FOUND, message: "option not found." },
    };

    ctx.response.status = 404;
    ctx.response.body = response;

    return;
  }

  const response: ApiResponse<Poll> = {
    success: true,
    data: pollRowToApi(pollRow, optionRows),
  };

  ctx.response.status = 200;
  ctx.response.body = response;
});

// Ajouter un sondage
router.post("/", (ctx: context) => {
  try {
    const pollId = crypto.randomUUID();
    const title = "sondageTestAJout";
    const description = "sondageDescriptionTest";
    const createdAt = new Date().toISOString();
    const status = "actif";
    const userId = "u1";
    const superpollId = "sp_tech";

    const insertResult = db
      .prepare(
        `INSERT INTO polls (poll_id, title, description, creation_date, status, user_id, superpoll_id) VALUES (:pollId, :title, :description, :createdAt, :status, :userId, :superpollId)`,
      )
      .run({
        pollId: pollId,
        title: title,
        description: description,
        createdAt: createdAt,
        status: status,
        userId: userId,
        superpollId: superpollId,
      });

    if (!insertResult || insertResult.changes === 0) {
      const response: ApiResponse<Poll> = {
        success: false,
        error: {
          code: ApiErrorCode.BAD_REQUEST,
          message: "error in the request.",
        },
      };

      ctx.response.status = 404;
      ctx.response.body = response;

      return;
    }

    const pollRow = db
      .prepare(
        `SELECT poll_id, title, description, creation_date, expiration_date, status, user_id, superpoll_id
    FROM polls WHERE poll_id = ?;`,
      )
      .get(pollId);

    if (!pollRow || !isPollRow(pollRow)) {
      const response: ApiResponse<Poll> = {
        success: false,
        error: {
          code: ApiErrorCode.BAD_REQUEST,
          message: "error in the request.",
        },
      };

      ctx.response.status = 404;
      ctx.response.body = response;

      return;
    }

    const response: ApiResponse<Poll> = {
      success: true,
      data: pollRowToApi(pollRow, []),
    };

    ctx.response.status = 200;
    ctx.response.body = response;
  } catch (err: any) {
    console.error("Erreur SQL détaillée :", err.message); // Regardez votre terminal où tourne 'deno task dev'
    ctx.response.status = 500;
    ctx.response.body = { success: false, error: { message: err.message } };
  }
});

// Modifier un sondage
router.put("/:pollId", (ctx: context) => {
  try {
    const pollId = ctx.params.pollId;
    const title = "sondageTestModificationtest";

    const updateResult = db
      .prepare(`UPDATE polls SET title = :title WHERE poll_id = :pollId`)
      .run({ pollId: pollId, title: title });

    if (!updateResult || updateResult.changes === 0) {
      const response: ApiResponse<Poll> = {
        success: false,
        error: {
          code: ApiErrorCode.BAD_REQUEST,
          message: "error in the request.",
        },
      };

      ctx.response.status = 404;
      ctx.response.body = response;

      return;
    }

    const pollRow = db
      .prepare(
        `SELECT poll_id, title, description, creation_date, expiration_date, status, user_id, superpoll_id
    FROM polls WHERE poll_id = ?;`,
      )
      .get(pollId);

    if (!pollRow || !isPollRow(pollRow)) {
      const response: ApiResponse<Poll> = {
        success: false,
        error: {
          code: ApiErrorCode.BAD_REQUEST,
          message: "error in the request.",
        },
      };

      ctx.response.status = 404;
      ctx.response.body = response;

      return;
    }

    const response: ApiResponse<Poll> = {
      success: true,
      data: pollRowToApi(pollRow, []),
    };

    ctx.response.status = 200;
    ctx.response.body = response;
  } catch (err: any) {
    console.error("Erreur SQL détaillée :", err.message); // Regardez votre terminal où tourne 'deno task dev'
    ctx.response.status = 500;
    ctx.response.body = { success: false, error: { message: err.message } };
  }
});

// Supprimer un sondage
router.delete("/:pollId", (ctx: context) => {
  try {
    const pollId = ctx.params.pollId;
    const deleteResult = db
      .prepare("DELETE FROM polls WHERE poll_id = :pollId")
      .run({ pollId: pollId });

    if (!deleteResult || deleteResult.changes === 0) {
      const response: ApiResponse<Poll> = {
        success: false,
        error: {
          code: ApiErrorCode.BAD_REQUEST,
          message: "error in the request.",
        },
      };

      ctx.response.status = 404;
      ctx.response.body = response;

      return;
    }

    const pollRow = db
      .prepare(
        `SELECT poll_id, title, description, creation_date, expiration_date, status, user_id, superpoll_id
    FROM polls WHERE poll_id = ?;`,
      )
      .get(pollId);

    if (!pollRow) {
      const response: ApiResponse<Poll> = {
        success: true,
        data: null as any,
      };

      ctx.response.status = 200;
      ctx.response.body = response;

      return;
    }
  } catch (err: any) {
    console.error("Erreur SQL détaillée :", err.message); // Regardez votre terminal où tourne 'deno task dev'
    ctx.response.status = 500;
    ctx.response.body = { success: false, error: { message: err.message } };
  }
});

export default router;
