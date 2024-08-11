import { useEffect, useState } from "react";
import { socket } from "../socket";
import Card from "./Card";

const CommonField = ({ myInfos, descarteGeral } ) => {
    const [isGameStarted, setIsGameStarted] = useState(false);

    useEffect(() => {
        if (myInfos.playing == true) {
            setIsGameStarted(true);
        }
    }, [myInfos.playing]);

    function handleIniciarPartida() {
        socket.emit("inicio_partida");
    }


    return (
        <section className="commom_field">
            <h2>Common Field</h2>
            {!isGameStarted && (
                <button onClick={handleIniciarPartida}>Iniciar partida</button>
            )}
            <div className="container_descarte_geral">
                <h3>Descarte Geral</h3>
                
                <Card 
                cardName={descarteGeral.nomeCarta}
                type={descarteGeral.type}
                icon={descarteGeral.icon}
                />
            </div>

        </section>
    );
};

export default CommonField;
