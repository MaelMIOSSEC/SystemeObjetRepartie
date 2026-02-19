import { useEffect, useRef } from "react";

import type { VoteAckMessage, VotesUpdateMessage } from "../types/voteType.ts";

const WS_URL = "ws://localhost:8000";

// Définition du hook, qui prend en paramètre l'identifiant du sondage courant, et les deux fonctions à exécuter à la réception de messages du serveur (respectivement `votes_update` et `vote_ack`)
export function useVoteSocket(
  pollId: string | undefined,
  {
    onUpdate,
    onAck,
  }: {
    onUpdate?: (msg: VotesUpdateMessage) => void;
    onAck?: (msg: VoteAckMessage) => void;
  }
) {
  // Le hook maintient une référence au WebSocket courant
  const socketRef = useRef<WebSocket | null>(null);

  // L'effet sera déclenché en fonction de ses dépendances :
  // - à tout changement de sondage courant (`pollId`) : le client se connecte à/se déconnecte d'un WebSocket par sondage ;
  // - à tout changement des fonctions `onUpdate` et `onAck` : ces fonctions capturent l'état du composant, elles sont donc recréées à chaque rendu
  useEffect(() => {
    if (!pollId) return;

    // On ouvre un WebSocket sur le canal du sondage courant
    const ws = new WebSocket(`${WS_URL}/votes/${pollId}`);
    socketRef.current = ws;

    // Événement : lors de la réception d'un message, on exécute la fonction appropriée en fonction de son type
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      if (msg.type === "votes_update" && onUpdate) {
        onUpdate(msg);
      }

      if (msg.type === "vote_ack" && onAck) {
        onAck(msg);
      }
    };

    // Fonction de nettoyage exécutée au démontage du composant :
    // On déconnecte le client du WebSocket
    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, [pollId, onUpdate, onAck]); // Dépendances de l'effet

  // Fonction retournée par le hook : envoi d'un vote
  // Envoi par le client d'un message `vote_cast` au serveur
  const vote = (optionId: string) => {
    // On récupère le WebSocket courant
    const ws = socketRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return { success: false, error: "Not connected" };
    }

    // On envoie le message sur le WebSocket
    ws.send(
      JSON.stringify({
        type: "vote_cast",
        pollId,
        optionId,
      })
    );

    return { success: true };
  };

  // Le hook retourne une fonction `vote` que l'on appelle dans le composant pour envoyer un message `vote_cast`
  return { vote };
}
