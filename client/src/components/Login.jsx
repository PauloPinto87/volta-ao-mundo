import { useContext, useEffect } from "react";
import { socket } from "../socket.js";
import UserContext from "../contexts/UserContext";

import { GiPerson } from "react-icons/gi";
import style from "./Login.module.css";

const Login = () => {
    const { setIsLogged, userName, setUserName, setMyId } =
        useContext(UserContext);

    useEffect(() => {
        function conexaoConfirmada(data) {
            setIsLogged(true);
            setMyId(data);
        }

        socket.on("conexao_confirmada", conexaoConfirmada);

        return () => {
            socket.off("data_player", conexaoConfirmada);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.connect();
        socket.emit("send_name", userName);
    };

    return (
        <section className={style.container}>
            <form onSubmit={handleSubmit}>
                <h2>Começar a viagem</h2>
                <div className={style.input_box}>
                    <GiPerson />
                    <input
                        type="text"
                        placeholder="Digite o seu nome"
                        required
                        onChange={(e) =>
                            setUserName(e.target.value.toUpperCase())
                        }
                    />
                </div>
                <button type="submit">Entrar</button>
            </form>
        </section>
    );
};

export default Login;
