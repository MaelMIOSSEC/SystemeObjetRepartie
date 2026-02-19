import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Poll } from "../../types/pollType.ts";
import type { Option } from "../../types/optionType.ts";
import type {
  VoteAckMessage,
  VotesUpdateMessage,
} from "../../types/voteType.ts";
import { useVoteSocket } from "../../hooks/useVoteSocket.ts"

function OptionPollCard({ option, onVote }: { option: Option; onVote: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  const optionStyle = {
    ...styles.option,
    transform: isHovered ? "scale(1.03)" : "scale(1)",
    boxShadow: isHovered ? "0px 10px 30px white" : "-3px 3px 20px white",
    borderColor: isHovered ? "#3b82f6" : "transparent",
    transition: "1s ease",
    cursor: "default",
  };

  return (
    <div
      style={optionStyle}
      onClick={onVote}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p>
        {option.descriptiveText === null
          ? "Aucune description liée à cette option"
          : option.descriptiveText}{" "}
      </p>
      <p
        style={{
          borderRadius: "10px",
          padding: "0 10px",
          backgroundColor: option.voteCount === 0 ? "#f8e0e0" : "#e0e5f8",
          color: option.voteCount === 0 ? "#dd1e05" : "#0525dd",
        }}
      >
        {option.voteCount === 0
          ? "Aucun vote"
          : `${option.voteCount} ${option.voteCount > 1 ? "votes" : "vote"}`}
      </p>
    </div>
  );
}

export default function Poll() {
  const { selectedPoll } = useParams();
  const [poll, setPoll] = useState<Poll>({
    pollId: "",
    title: "",
    description: "",
    creationDate: "",
    expirationDate: "",
    status: "",
    userId: "",
    // superpollId: "",
    options: [],
  });

  const [, setAnimatingOptionId] = useState<string | null>(null);
  const [, setVoteError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/polls/${selectedPoll}`
        );

        const data = await response.json();

        setPoll(data.data);
      } catch (err) {
        console.error("Échec de la récupération : ", err);
      }
    })();
  }, [selectedPoll]);

  // On définit la fonction à exécuter à la réception d'un message `votes_update`
  const handleUpdate = useCallback((update: VotesUpdateMessage) => {
    setPoll((prev) => {
      // Si prev est null ou n'a pas encore de données réelles
      if (!prev || prev.pollId === "") return prev;
  
      return {
        ...prev,
        options: prev.options.map((opt) =>
          opt.optionId === update.optionId // Utilise optionId pour être cohérent
            ? { ...opt, voteCount: update.voteCount }
            : opt
        ),
      };
    });
    setAnimatingOptionId(update.optionId);
  }, []);

  // On définit la fonction à exécuter à la réception d'un accusé de réception `vote_ack`
  const handleAck = useCallback((ack: VoteAckMessage) => {
    if (!ack.success) {
      setVoteError(ack.error?.message || "Une erreur inconnue est survenue");
    }
  }, []);

  // On initialise le hook `useVoteSocket` qui se déclenchera à la réception de tout message (voir étape suivante dans le sujet)
  // On lui passe l'identifiant du sondage courant, et les méthodes à aossier aux deux types de message
  // La fonction `vote` qu'il retourne doit être utilisée dans le composant pour envoyer un vote (lorsque l'utilisateur sélectionne une option de sondage)
  const { vote } = useVoteSocket(selectedPoll, {
    onUpdate: handleUpdate,
    onAck: handleAck,
  });

  if (!poll) {
    return (
      <h1>
        <b>Chargement du sondage...</b>
      </h1>
    );
  }

  return (
    <>
      <div style={styles.poll}>
        <a href={`/polls/${poll.pollId}`} style={{ color: "black" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>{poll.title}</h2>
            <p style={styles.pollId}>#{poll.pollId} </p>
          </div>
          <hr />
          <div style={styles.pollStatus(poll.status)}>
            {poll.status === "open" ? "● Actif" : "○ Inactif"}
          </div>
          <p style={{ textAlign: "center" }}>{poll.description}</p>
          <div>
            <div>
              <div style={styles.metaValues}>
                <div style={styles.metaValue}>
                  <p style={styles.metaLabel}>📅 Création</p>
                  <p>{new Date(poll.creationDate).toLocaleDateString()}</p>
                </div>

                <div style={styles.metaValue}>
                  <p style={styles.metaLabel}>⏳ Expiration</p>
                  <p>
                    {poll.expirationDate === null ||
                    poll.expirationDate === undefined
                      ? "non renseignée"
                      : new Date(poll.expirationDate).toLocaleDateString()}
                  </p>
                </div>

                <div style={styles.metaValue}>
                  <p style={styles.metaLabel}>👤 Utilisateur</p>
                  <p>{poll.userId}</p>
                </div>
              </div>
            </div>
          </div>
          <h4
            style={{
              textAlign: "center",
              textTransform: "uppercase",
              color: "grey",
            }}
          >
            Options disponibles
          </h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {poll.options?.map((option) => (
              <OptionPollCard key={option.optionId} option={option} onVote={() => vote(option.optionId)} />
            ))}
          </div>
        </a>
      </div>
      <a
        href="/"
        style={{
          border: "1px solid",
          padding: "15px",
          margin: "78px",
          textTransform: "uppercase",
          borderRadius: "15px",
          fontSize: "20px",
        }}
      >
        Step Backward
      </a>
    </>
  );
}

const styles: any = {
  pollOrganisation: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "1400px",
  },
  poll: {
    borderRadius: "25px",
    margin: "20px 20px 50px 20px",
    padding: "15px 25px 40px 25px",
    textAlign: "left",
    maxWidth: "830px",
    width: "600px",
    backgroundColor: "white",
    color: "black",
    boxShadow: "-3px 3px 20px white",
  },
  pollId: {
    borderRadius: "10px",
    padding: "2px 10px",
    backgroundColor: "lightgray",
    opacity: "0.7",
    height: "27px",
  },
  pollStatus: (isActive: string) => ({
    borderRadius: "10px",
    width: "fit-content",
    padding: "2px 10px",
    fontSize: "15px",
    backgroundColor: isActive === "open" ? "#53ff8f" : "#fdb2b2",
    opacity: "0.8",
    color: isActive === "open" ? "#006323" : "#fa3131",
    margin: "20px 0",
  }),
  metaValues: {
    borderRadius: "15px",
    display: "flex",
    flexDirection: "row",
    width: "550px",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
    padding: "10px",
    backgroundColor: "#f8f8f8",
  },
  metaLabel: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: "0.1em",
  },
  metaValue: {
    margin: "0 15px",
    textAlign: "center",
    padding: "0 15px",
  },
  option: {
    display: "flex",
    flexDirection: "row",
    border: "1px solid",
    borderRadius: "20px",
    margin: "10px",
    padding: "2px 10px",
    justifyContent: "space-between",
  },
};
