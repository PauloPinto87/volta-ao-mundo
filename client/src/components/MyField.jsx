import { useContext, useState } from "react";
import { socket } from "../socket";
import UserContext from "../contexts/UserContext";
// Elementos
import ModalOptions from "./ModalOptions";
import Card from "./Card";

// Css
import style from "./MyField.module.css";

const MyField = ({ myInfos }) => {
    const { myId } = useContext(UserContext);
    const { userName } = useContext(UserContext);
    const myHandCards = myInfos.handCards || [];
    const steps = myInfos?.steps || [];
    const myTurn = steps[1] && steps[1].drawCard ? steps[1].drawCard : false;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [indexCardDiscart, setIndexCardDiscart] = useState(null);

    function comprarUmaCarta() {
        socket.emit("comprar_carta");
    }

    function handleDescartar(index) {
        setIndexCardDiscart(index);
        setIsModalOpen(true);
    }

    socket.on("carta_descartada", (data) => {
        console.log("A carta descarta é: ", data);
    });

    function handleChoice(choice) {
        if (choice !== "Cancelar") {
            socket.emit("descarte", indexCardDiscart, choice);
        }
        setIsModalOpen(false);
    }

    function renderizarCartasQuilometros(stackQuilometros) {
        if (stackQuilometros) {
            return Object.keys(stackQuilometros).map(
                (tipoTransporte, indexParent) => (
                    <section key={`${tipoTransporte} - ${indexParent}`}>
                        {stackQuilometros[tipoTransporte].map(
                            (transporteUsado, index) => (
                                renderizarCartaGeral(transporteUsado, `${transporteUsado} - ${index}`, false, steps)
                            )
                        )}
                    </section>
                )
            );
        }
        return null;
    }

    function renderizarCartaGeral(card, key,  descartavelBoolean, steps){
        return (
            <Card 
                card={card}
                key={key}
                descartavel={descartavelBoolean}
                onDescartar={() => handleDescartar(key, myId)}
                steps={steps}
            />
        )
    }

    return (
        <section className={style.my_field}>
            <header>
                <h2>My Field</h2>
                <h3>
                    {steps[0]?.waitOtherPlayer && <p>Aguarde o outro jogador terminar</p>}
                    {steps[1]?.drawCard && <p>Compre uma carta!</p>}
                    {steps[2]?.discart && <p>Descarte uma carta!</p>}
                </h3>
                <p>Jogador(a): {userName}</p>
                {myTurn && (
                    <button onClick={comprarUmaCarta}>Comprar uma carta</button>
                )}
            </header>

            <section className={style.all_my_cards}>
                <div className={style.my_front_field}>
                    <section className={style.defense_zone}>
                        <h3>Área de defesa</h3>
                        <div className={style.container_defense_cards}>
                            {myInfos?.stacks?.defesa.map((carta, index) => (
                                renderizarCartaGeral(carta, index, false, steps)
                            ))}
                        </div>
                    </section>

                    <section className="terrain_zone">
                        <h3>Terrenos</h3>
                        {
                            renderizarCartaGeral(myInfos?.stacks?.terreno || '', 'terreno', false, steps)
                        }
                    </section>
                    <section className="battle_stack">
                        <h3>Batalha</h3>
                        {
                            renderizarCartaGeral(myInfos?.stacks?.batalha || '', 'batalha', false, steps)
                        }
                    </section>

                    <section className={style.km_zone}>
                        <h3>Quilômetros viajados</h3>
                        
                        {renderizarCartasQuilometros(
                            myInfos?.stacks?.quilometros
                        )}
                    </section>
                </div>

                <section className={style.my_hand_card}>
                    <h3>Minha mão</h3>
                    {myHandCards.map((card, index) => (
                        renderizarCartaGeral(card, index, true, steps)
                    ))}
                </section>

                {isModalOpen && <ModalOptions onChoice={handleChoice} />}
            </section>
        </section>
    );
};

export default MyField;
