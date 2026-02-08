import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { type Poll, isPollRow } from "../../types.ts";

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

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/polls/${selectedPoll}`,
        );

        const data = await response.json();

        setPoll(data.data);
      } catch (err) {
        console.error("Échec de la récupération : ", err);
      }
    })();
  }, [selectedPoll]);

  if (!poll || !isPollRow(poll)) {
    console.log("poll => ", poll);
    console.log("isPollRow(poll) => ", isPollRow(poll));
    return <p>Chargement du sondage...</p>;
  }

  return (
    <>
      <ul>
        <li>
          Titre et numéro du sondage : {poll.title} - {poll.pollId}{" "}
        </li>
        <ul>
          <li>Description : {poll.description}</li>
          <li>Date de création : {poll.creationDate}</li>
          <li>
            Date d'expiration :{" "}
            {poll.expirationDate === null
              ? "Aucune date d'expiration"
              : poll.expirationDate}
          </li>
          <li>Statut : {poll.status}</li>
          <li>
            Identifiant de l'utilisateur :{" "}
            {poll.userId === null
              ? "Aucun utilisateur associé à ce sondage"
              : poll.userId}
          </li>
          <li>
            Options :{" "}
            {poll.options.map((option) => (
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
                  {option.voteCount === 0
                    ? "Pas de vote"
                    : option.voteCount}{" "}
                </li>
              </ul>
            ))}
          </li>
        </ul>
      </ul>
    </>
  );
}
