import { useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import { socket } from "../socket";
import waitingImage from '../assets/waiting.gif';

import style from './WaitingPlayer.module.css'

const WaitingPlayer = () => {
    const { userName, setIsFullRoom } = useContext(UserContext);

    useEffect(() => {
        const handleRoomFull = () => {
            setIsFullRoom(true);
        };

        socket.on("room_full", handleRoomFull);

        return () => {
            socket.off("room_full", handleRoomFull);
        };
    }, []);

    return (
        <div className={style.container}>
            <h3>Olá {userName}, aguardando o outro jogador conectar!</h3>
            <img src={waitingImage} alt="aguardando" />
        </div>
    );
};

export default WaitingPlayer;
