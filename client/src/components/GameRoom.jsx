import { useContext, useEffect, useState } from "react";
import { socket } from "../socket";
import _ from "lodash";
import styles from "./GameRoom.module.css";

import MyField from "./MyField";
import EnemyField from "./EnemyField";
import CommonField from "./CommonField";
import UserContext from "../contexts/UserContext";

const GameRoom = () => {
    const { myId } = useContext(UserContext);
    const [playersList, setPlayerList] = useState([]);
    const [descarteGeral, setDescarte] = useState({});

    useEffect(() => {
        socket.emit("pedido_playersList");

        function handleUpdatePlayerList(newPlayersList, newDescarteGeral) {
            if (!_.isEqual(newPlayersList, playersList)) {
                setPlayerList(newPlayersList);
            }

            if (!_.isEqual(newDescarteGeral, descarteGeral)) {
                setDescarte(newDescarteGeral);
            }
        }

        socket.on("refresh_users_info", handleUpdatePlayerList);

        return () => {
            socket.off("refresh_users_info", handleUpdatePlayerList);
        };
    }, [playersList, descarteGeral]);

    const enemyInfos =
        playersList.filter((player) => player.id !== myId)[0] || false;
    const myInfos =
        playersList.filter((player) => player.id == myId)[0] || false;

    //console.log("enemyInfos ", enemyInfos);
    //console.log("descarteGeral -- >", descarteGeral);

    return (
        <section className={styles.gameroom}>
            <div className={styles.enemy_common_box}>
                <CommonField myInfos={myInfos} descarteGeral={descarteGeral} />
                <EnemyField enemyInfos={enemyInfos} />
            </div>
            <MyField myInfos={myInfos} />
        </section>
    );
};

export default GameRoom;
