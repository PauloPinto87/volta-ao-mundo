import styles from "./EnemyField.module.css";

const EnemyField = ({ enemyInfos }) => {
    function renderHandCardsEnemy(qntCards) {
        if (qntCards > 0) {
            const cards = [];
            for (let i = 0; i < qntCards; i++) {
                cards.push(<div key={i} className={styles.back_card}></div>);
            }

            return(
              <div className={styles.hand_cards_box}>{cards}</div>
            )
        } else {
            return <p>Sem cartas</p>;
        }
    }

    return (
        <section className={styles.enemy_field}>
            <h2>EnemyField</h2>
            <p>Adversário {enemyInfos.name}</p>
            {renderHandCardsEnemy(enemyInfos?.handCards?.length)}
        </section>
    );
};

export default EnemyField;
