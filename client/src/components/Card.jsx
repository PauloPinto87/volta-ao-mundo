import { useEffect, useState } from "react";
import styles from "./Card.module.css";

const Card = ({ card, descartavel, onDescartar, steps }) => {
    const [IconComponent, setIconComponent] = useState(null);

    useEffect(() => {
        //Função para importar o icone dinamicamente
        async function loadIcon() {
            if (card?.icon) {
                try {
                    const { [card?.icon]: DynamicIcon } = await import(
                        "react-icons/gi"
                    );
                    setIconComponent(() => DynamicIcon);
                } catch (error) {
                    console.error(`Ícone ${card?.icon} não encontrado.`);
                }
            }
        }
        loadIcon();
    }, [card]);

    function buttonDelete(descartavel, steps) {
        if (descartavel && steps[2].discart) {
            return <button onClick={onDescartar}>Descartar</button>;
        }
    }


    return (
        <div className={`${styles.card} ${styles[`card_${card?.type}`]}`}>
            <h4>{card?.type > 0 ? card?.type : card?.nomeCarta}</h4>
            <span>{IconComponent && <IconComponent />}</span>
            <div className="actions_card">

            {buttonDelete(descartavel, steps)}
            </div>
        </div>
    );
};

export default Card;
