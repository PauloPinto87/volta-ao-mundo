const EnemyField = ({ enemyInfos }) => {
  const handCards = enemyInfos.handCards || [];

  return (
    <section className="enemy_field">
      <h2>EnemyField</h2>
      <p>Adversário {enemyInfos.name}</p>
      <p>Numero de cartas na mão {handCards.length}</p>
    </section>
  );
};

export default EnemyField;
