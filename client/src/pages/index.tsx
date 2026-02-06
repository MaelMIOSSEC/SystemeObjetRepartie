import { useEffect, useState } from "react";
import type { PollRow, Option } from "../../types.ts";

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

      {Array.isArray(polls) &&
        polls.map((poll) => (
          <div
            style={{
              border: "1px solid",
              borderRadius: "20px",
              margin: "10px 0 10px 0",
              padding: "15px 25px 40px 25px",
              textAlign: "left",
            }}
          >
            <h2>
              {poll.title} - {poll.pollId}{" "}
            </h2>
            <hr />
            <div>
              <h4>Description :</h4>
              <p>{poll.description}</p>
            </div>
            <div
              style={{
                border: "1px solid",
                borderRadius: "5px",
                width: "fit-content",
                padding: "5px",
              }}
            >
              Statut : {poll.status} {poll.status === "actif" ? "✅️" : "❌"}
            </div>
            <div>
              <h4>Métadonnées : </h4>
              <div
                style={{
                  border: "1px solid",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "row",
                  width: "fit-content",
                }}
              >
                <div style={{ margin: "0 15px 0 15px" }}>
                  <p>📅 Création :</p>
                  <p>{poll.creationDate}</p>
                </div>
                <div style={{ margin: "0 15px 0 15px" }}>
                  <p>⏳ Expiration :</p>
                  <p>
                    {poll.expirationDate === null
                      ? "Aucune date d'expiration"
                      : poll.expirationDate}
                  </p>
                </div>
                <div style={{ margin: "0 15px 0 15px" }}>
                  <p>👨🏻‍💼 Utilisateur : </p>
                  <p>
                    {poll.userId === null
                      ? "Aucun utilisateur associé à ce sondage"
                      : poll.userId}
                  </p>
                </div>
              </div>
            </div>
            <li>
              Options :{" "}
              {poll.options?.map((option: Option) => (
                <ul>
                  <li>Date de création de l'option : {option.creationDate} </li>
                  <li>
                    Description de l'option :{" "}
                    {option.descriptiveText === null
                      ? "Aucune description liée à cette option"
                      : option.descriptiveText}{" "}
                  </li>
                  <li>
                    Nombre de votes de l'option :{" "}
                    {option.voteCount === 0 ? "Pas de vote" : option.voteCount}{" "}
                  </li>
                </ul>
              ))}
            </li>
          </div>
        ))}
    </main>
  );
}
