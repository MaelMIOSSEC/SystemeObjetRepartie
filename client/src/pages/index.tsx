import { useEffect, useState } from "react";
import type { PollRow, Option } from "../../types.ts";

export default function Index() {
  const [polls, setPolls] = useState<PollRow[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("http://localhost:8000/polls");

        const data = await response.json();

        console.log(data);

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

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          width: "1400px",
        }}
      >
        {Array.isArray(polls) &&
          polls.map((poll) => (
            <div style={styles.poll}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>{poll.title}</h2>
                <p
                  style={{
                    borderRadius: "10px",
                    padding: "2px 10px",
                    backgroundColor: "lightgray",
                    opacity: "0.7",
                    height: "27px",
                  }}
                >
                  #{poll.pollId}{" "}
                </p>
              </div>
              <hr />
              <div
                style={{
                  borderRadius: "10px",
                  width: "fit-content",
                  padding: "2px 10px",
                  fontSize: "15px",
                  backgroundColor:
                    poll.status === "open" ? "#53ff8f" : "#fdb2b2",
                  opacity: "0.8",
                  color: poll.status === "open" ? "#006323" : "#fa3131",
                  margin: "20px 0",
                }}
              >
                {poll.status === "open" ? "● Actif" : "○ Inactif"}
              </div>
              <p style={{ textAlign: "center" }}>{poll.description}</p>
              <div>
                <div>
                  <div
                    style={{
                      borderRadius: "15px",
                      display: "flex",
                      flexDirection: "row",
                      width: "550px",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "0 auto",
                      padding: "10px",
                      backgroundColor: "#f8f8f8",
                    }}
                  >
                    {/* On applique textAlign: "center" sur chaque colonne */}
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
                      <p>{poll.userId || "Anonyme"}</p>
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      border: "1px solid",
                      borderRadius: "20px",
                      margin: "10px",
                      padding: "2px 10px",
                      justifyContent: "space-between",
                    }}
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
                        backgroundColor: "#e0e5f8",
                        color: "#0525dd",
                      }}
                    >
                      {option.voteCount === 0
                        ? "Aucun vote"
                        : `${option.voteCount} ${option.voteCount > 1 ? "votes" : "vote"}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const styles: any = {
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
};
