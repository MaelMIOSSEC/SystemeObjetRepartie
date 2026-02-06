import { useEffect, useState } from "react";
import type { PollRow } from "../../types.ts";
import { pollRowToApi } from "../../mappers.ts";

export default function Index() {
    const[polls, setPolls] = useState<PollRow[]>([]);

    useEffect(() => {
        (async() => {
            try {
                const response = await fetch("http://localhost:8000/polls")
                
                const data = await response.json();

                console.log("data =>", data)

                setPolls(data.data);
            } catch (err) {
                console.error("Échec de la récupération : ", err);
            }
        })();
    }, []);

    const cleanPolls = polls.map(row => pollRowToApi(row));

    return (
        <main id="content">
            <h1>📊 Real-time polls</h1>
            <p>Click on a poll below to participate.</p>

            <ul>
                {Array.isArray(cleanPolls) && cleanPolls.map((poll) => 
                    <>
                        <li>Titre et numéro du sondage : { poll.title } - { poll.pollId } </li>
                        <ul>
                            <li>Description : { poll.description }</li>
                            <li>Date de création : { poll.creationDate }</li>
                            <li>Date d'expiration : { poll.expirationDate === null ? "Aucune date d'expiration" : poll.expirationDate }</li>
                            <li>Statut : { poll.status }</li>
                            <li>Identifiant de l'utilisateur : { poll.userId === null ? "Aucun utilisateur associé à ce sondage" : poll.userId }</li>
                            <li>Options : { 
                                poll.options?.map(option => 
                                    <ul>
                                        <li>Date de création de l'option : { option.creationDate } </li>
                                        <li>Description de l'option : { option.descriptiveText === null ? "Aucune description liée à cette option" : option.descriptiveText} </li>
                                        <li>Nombre de votes de l'option : { option.voteCount === 0 ? "Pas de vote" : option.voteCount} </li>
                                    </ul>
                                ) 
                            }</li>
                        </ul>
                    </>
                )}
            </ul>
        </main>
    )
}