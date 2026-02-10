import { DatabaseSync } from "node:sqlite";
import { ApiErrorCode, APIException } from "../types/exceptionType";
import { VotesUpdateMessage, VoteCastMessage } from "../types/voteType";

const subscriptions = new Map<string, Set<WebSocket>>();

function castVote(
  db: DatabaseSync,
  pollId: string,
  optionId: string,
  userId?: string
): number {
  try {
    let insertVote;

    const optionIdRow = db
      .prepare(
        "SELECT option_id as optionId FROM options WHERE option_id = ? AND poll_id = ?"
      )
      .get(optionId, pollId);

    if (optionIdRow && typeof optionIdRow.optionId === "string") {
      if (optionIdRow) {
        db.prepare("BEGIN").run();

        insertVote = db
          .prepare(
            "INSERT INTO votes (creation_date, user_id, option_id, poll_id) VALUES(:creationDate, :userId, :optionId, :pollId)"
          )
          .run({
            creationDate: new Date().toISOString(),
            userId: userId ?? null,
            optionId: optionId,
            pollId: pollId,
          });

        db.prepare(
          "UPDATE options SET vote_count = vote_count + 1 WHERE option_id = :optionId"
        ).run({ optionId: optionId });

        db.prepare("COMMIT").run();

        return insertVote.changes;
      }
    }

    return 0;
  } catch (err) {
    db.prepare("ROLLBACK").run();
    console.error("Erreur SQL détaillée :", err.message);
    return 0;
  }
}

export function subscribe(ws: WebSocket, pollId: string): void {
  const pollSubscription = subscriptions.get(pollId) ?? new Set<WebSocket>();

  subscriptions.set(pollId, pollSubscription.add(ws));
}

export function unsubscribe(ws: WebSocket, pollId: string): void {
  const pollSubscription = subscriptions.get(pollId);

  if (pollSubscription) {
    pollSubscription.delete(ws);

    if (pollSubscription.size === 0) {
      subscriptions.delete(pollId);
    }
  }
}

export function broadcast(pollId: string, message: VotesUpdateMessage): void {
  const pollSubscription = subscriptions.get(pollId);

  if (pollSubscription) {
    for (let ws of pollSubscription.keys()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    }
  }
}

export function handleVoteMessage(
  db: DatabaseSync,
  ws: WebSocket,
  msg: VoteCastMessage
): void {
  try {
    const voteResult = castVote(db, msg.pollId, msg.optionId, msg.userId);

    if (voteResult > 0) {
      const voteCountRow = db
        .prepare(
          "SELECT vote_count as voteCount FROM options where option_id = ?"
        )
        .get(msg.optionId);
      let voteCountNumber = 0;

      if (voteCountRow && typeof voteCountRow.voteCount === "number") {
        voteCountNumber = voteCountRow.voteCount;
      }

      const updateMessage: VotesUpdateMessage = {
        type: "votes_update",
        pollId: msg.pollId,
        optionId: msg.optionId,
        voteCount: voteCountNumber,
      };

      broadcast(msg.pollId, updateMessage);
    } else {
      sendError(
        ws,
        new APIException(ApiErrorCode.BAD_REQUEST, 400, "vote update error...")
      );
    }
  } catch (err) {
    console.error("Erreur SQL détaillée :", err.message);
    sendError(
      ws,
      new APIException(
        ApiErrorCode.SERVER_ERROR,
        500,
        "internal error server..."
      )
    );
  }
}

export function sendError(ws: WebSocket, exception: APIException): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(exception));
  }
}
