import type { VoteAckMessage, VotesUpdateMessage } from "../types/voteType.ts";

let ws: WebSocket | null = null;
let pollId: string | null = null;

const updateCallbacks = new Set<(update: VotesUpdateMessage) => void>();
const ackCallbacks = new Set<(ack: VoteAckMessage) => void>();

export function connect(newPollId: string): void {
  pollId = newPollId;

  // On ferme un éventuel WebSocket précédent
  if (ws) ws.close();

  // Le protocole n'est plus HTTP !
  ws = new WebSocket(`ws://localhost:8000/votes/${pollId}`);

  // Événement : réception d'un message
  ws.onmessage = (e) => {
    // Attention : valider les données entrantes
    const msg = JSON.parse(e.data);

    // En fonction du type de message, on exécute les fonctions appropriées en leur passant le message reçu
    if (msg.type === "votes_update") {
      updateCallbacks.forEach((cb) => cb(msg));
    } else if (msg.type === "vote_ack") {
      ackCallbacks.forEach((cb) => cb(msg));
    }
  };
}

export function disconnect(): void {
  if (ws) ws.close();
  ws = null;
  pollId = null;
}

export function vote(optionId: string): { success: boolean; error?: string } {
  // Le WebSocket n'est pas ouvert
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    return { success: false, error: "Not connected" };
  }

  // Envoi du vote de l'utilisateur
  ws.send(JSON.stringify({ type: "vote_cast", pollId, optionId }));

  return { success: true };
}

// Réception d'une mise à jour des compteurs de votes
export function onVoteUpdate(
  cb: (update: VotesUpdateMessage) => void
): () => void {
  updateCallbacks.add(cb);
  return () => updateCallbacks.delete(cb);
}

// Réception d'un accusé de réception du serveur
export function onVoteAck(cb: (ack: VoteAckMessage) => void): () => void {
  ackCallbacks.add(cb);
  return () => ackCallbacks.delete(cb);
}
