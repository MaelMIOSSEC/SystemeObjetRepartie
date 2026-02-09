import { DatabaseSync } from "node:sqlite";
import { APIException } from "../types/exceptionType";

const subscriptions = new Map<string, Set<WebSocket>>();

function castVote(
    db: DatabaseSync,
    pollId: string,
    oprionId: string,
    userId?: string,
): number {

}

export function subscribe(ws: WebSocket, pollId: string): void {

}

export function broadcast(pollId: string, message: VotesUpdateMessage): void {

}

export function handleVoteMessage(
    db: DatabaseSync,
    ws: WebSocket,
    msg: VoteCastMessage,
): void {

}

export function sendError(ws: WebSocket, exception: APIException): void {
    
}