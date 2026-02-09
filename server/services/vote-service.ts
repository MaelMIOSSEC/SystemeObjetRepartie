import { DatabaseSync } from "node:sqlite";
import { APIException } from "../types/exceptionType";
import { VotesUpdateMessage, VoteCastMessage } from "../types/voteType";

const subscriptions = new Map<string, Set<WebSocket>>();

function castVote(
    db: DatabaseSync,
    pollId: string,
    optionId: string,
    userId?: string,
): number {

}

export function subscribe(ws: WebSocket, pollId: string): void {
    const pollSubscription = subscriptions.get(pollId) ?? new Set<WebSocket>();
    
    subscriptions.set(pollId, pollSubscription.add(ws));
}

export function unsubscribe(ws: WebSocket, pollId: string): void {
const pollSubscription = subscriptions.get(pollId);

    if (pollSubscription) {
        subscriptions.delete(pollId);
    }
}

export function broadcast(pollId: string, message: VotesUpdateMessage): void {
    const pollSubscription = subscriptions.get(pollId);

    if (pollSubscription) {
        subscriptions.delete(pollId);
    }
}

export function handleVoteMessage(
    db: DatabaseSync,
    ws: WebSocket,
    msg: VoteCastMessage,
): void {

}

export function sendError(ws: WebSocket, exception: APIException): void {
    
}