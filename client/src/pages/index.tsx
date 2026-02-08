import { useEffect, useState } from "react";
import type { PollRow, Option } from "../../types.ts";

function PollCard({ poll }: { poll: PollRow }) {
  const [isHovered, setIsHovered] = useState(false);

  const pollStyle = {
    ...styles.poll,
    transform: isHovered ? "scale(1.03)" : "scale(1)",
    boxShadow: isHovered ? "0px 10px 30px white" : "-3px 3px 20px white",
    borderColor: isHovered ? "#3b82f6" : "transparent",
    transition: "1s ease",
    cursor: "pointer",
  };

  return (
    <div
      style={pollStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
          {poll.options?.map((option: Option) => (
            <div style={styles.option}>
              <p>
                {option.descriptiveText === null
                  ? "Aucune description liée à cette option"
                  : option.descriptiveText}{" "}
              </p>
              <p
                style={{
                  borderRadius: "10px",
                  padding: "0 10px",
                  backgroundColor:
                    option.voteCount === 0 ? "#f8e0e0" : "#e0e5f8",
                  color: option.voteCount === 0 ? "#dd1e05" : "#0525dd",
                }}
              >
                {option.voteCount === 0
                  ? "Aucun vote"
                  : `${option.voteCount} ${option.voteCount > 1 ? "votes" : "vote"}`}
              </p>
            </div>
          ))}
        </div>
      </a>
    </div>
  );
}

export default function Index() {
  const [polls, setPolls] = useState<PollRow[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("http://localhost:8000/polls");

        const data = await response.json();

        setPolls(data.data);
      } catch (err) {
        console.error("Échec de la récupération : ", err);
      }
    })();
  }, []);

  return (
    <main id="content">
      <h1>📊 Real-time polls</h1>
      <p>Click on a poll below to participate.</p>

      <div style={styles.pollOrganisation}>
        {Array.isArray(polls) &&
          polls.map((poll) => <PollCard key={poll.pollId} poll={poll} />)}
      </div>
    </main>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const styles: any = {
  pollOrganisation: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "1400px",
  },
  poll: {
    borderRadius: "25px",
    margin: "20px 20px",
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
