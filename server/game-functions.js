let deck = [
  {
    nomeCarta: "Orientação",
    quantidade: 14,
    type: "orientação",
    icon: "GiCompass",
  },
  { nomeCarta: "Perdido", quantidade: 5, type: "contratempo", icon: "GiShrug" },
  {
    nomeCarta: "Fim do Dinheiro",
    quantidade: 3,
    type: "contratempo",
    icon: "GiUnderwear",
  },
  {
    nomeCarta: "Trabalho",
    quantidade: 6,
    type: "liberação",
    icon: "GiHammerNails",
  },
  {
    nomeCarta: "Povos Hostis",
    quantidade: 6,
    type: "contratempo",
    icon: "GiMummyHead",
  },
  { nomeCarta: "Fuga", quantidade: 6, type: "liberação", icon: "GiSprint" },
  {
    nomeCarta: "Epidemia",
    quantidade: 3,
    type: "contratempo",
    icon: "GiMorbidHumour",
  },
  {
    nomeCarta: "Remédio",
    quantidade: 6,
    type: "liberação",
    icon: "GiMedicines",
  },
  { nomeCarta: "Mar", quantidade: 4, type: "terreno", icon: "GiAtSea" },
  {
    nomeCarta: "Terra Civilizada",
    quantidade: 5,
    type: "terreno",
    icon: "GiSaloon",
  },
  {
    nomeCarta: "Terra Selvagem",
    quantidade: 4,
    type: "terreno",
    icon: "GiMountainRoad",
  },
  {
    nomeCarta: "Sem recursos de Transporte",
    quantidade: 3,
    type: "terreno",
    icon: "GiTortoise",
  },
  { nomeCarta: "Saúde", quantidade: 1, type: "defesa", icon: "GiStrongMan" },
  {
    nomeCarta: "Diplomacia",
    quantidade: 1,
    type: "defesa",
    icon: "GiShakingHands",
  },
  {
    nomeCarta: "Riqueza",
    quantidade: 1,
    type: "defesa",
    icon: "GiTakeMyMoney",
  },
  {
    nomeCarta: "Rotas Alternativas",
    quantidade: 1,
    type: "defesa",
    icon: "GiTreasureMap",
  },
  { nomeCarta: "A pé", quantidade: 10, type: 1000, icon: "GiWalk" },
  { nomeCarta: "A cavalo", quantidade: 10, type: 2000, icon: "GiHorseHead" },
  { nomeCarta: "De vapor", quantidade: 10, type: 5000, icon: "GiShipBow" },
  {
    nomeCarta: "De trem",
    quantidade: 12,
    type: 4000,
    icon: "GiSteamLocomotive",
  },
  { nomeCarta: "De balão", quantidade: 4, type: 8000, icon: "GiAirBalloon" },
];

// Cria um array de obj com as qnts de cartas especificadas.
deck = deck.flatMap((carta) => {
  return Array(carta.quantidade).fill(carta);
});

let descarteGeral = {
  nomeCarta: "",
  type: "",
  icon: "",
};

let playersList = [];

function jogadorConectado(socket, name) {
  const newPlayer = {
    id: socket.id,
    name: name,
    logged: true,
    playing: false,
    handCards: [],
    steps: [
      { waitOtherPlayer: false },
      { drawCard: false },
      { discart: false },
    ],
    stacks: {
      defesa: [],
      terreno: {},
      batalha: {},
      quilometros: {
        aPe: [],
        aCavalo: [],
        deTrem: [],
        deVapor: [],
        deBalao: [],
      },
    },
  };
  playersList.push(newPlayer);
}

// Lida com toda a rotina do inicio da partida
function inicioPartida() {
  // Distribui 6 cartas para cada jogador
  playersList.map((player) => {
    for (let i = 0; i < 6; i++) {
      const card = drawCard();
      player.handCards.push(card);
    }
    player.playing = true;
  });

  // Define qual o jogador começa a jogar
  const numRand = Math.floor(Math.random() * playersList.length);
  const playerSelect = playersList[numRand] || [];
  const step = playerSelect.steps[1] || [];
  step.drawCard = true;

  if (numRand === 0) {
    playersList[1].steps[0].waitOtherPlayer = true;
  } else {
    playersList[0].steps[0].waitOtherPlayer = true;
  }
}

function procurarJogador(typeSearch, socket) {
  if (typeSearch === "exclusive") {
    const enemies = playersList.filter((player) => player.id !== socket.id);
    return enemies.length === 1 ? enemies[0] : enemies;
  } else {
    return playersList.find((player) => player.id === socket.id);
  }
}

function jogadorDesconectado(socket) {
  const player = procurarJogador("inclusive", socket);
  if (player) {
    console.log(`Usuário desconectado: ${player.name} - ${socket.id}`);
  } else {
    console.log(`Usuário desconectado: Não encontrado - ${socket.id}`);
  }

  const actualPlayersList = procurarJogador("exclusive", socket);

  playersList.length = 0;
  playersList.push(...actualPlayersList);

  console.log("Nº usuários ainda conectados: ", playersList.length);
}

function drawCard(socket) {
  //Número aleatório para usar como index p/ compra da carta
  const numDrawCard = Math.floor(Math.random() * deck.length);
  const drawCard = deck[numDrawCard];
  deck = deck.filter((_, index) => index !== numDrawCard);

  //Quando a solicitação é comprar uma carta
  if (socket) {
    const player = procurarJogador("inclusive", socket);
    player.handCards.push(drawCard);
    console.log(
      `Jogador ${player.name} comprou a carta: ${drawCard.nomeCarta}`
    );

    player.steps[1].drawCard = false;
    player.steps[2].discart = true;
  }

  return drawCard;
}

function descarte(indexCardDiscart, choice, socket) {
  const player = procurarJogador("inclusive", socket);
  const enemyPlayer = procurarJogador("exclusive", socket);

  const cardDiscart = player.handCards[indexCardDiscart];

  let target;
  let finishDiscart = true;

  if (choice === "Próprio campo") {
    target = player;
  } else if (choice === "Campo adversário") {
    target = enemyPlayer;
  } else {
    descarteGeral.nomeCarta = cardDiscart.nomeCarta;
    descarteGeral.type = cardDiscart.type;
    descarteGeral.icon = cardDiscart.icon;
  }

  if (choice !== "Descarte geral") {
    switch (true) {
      case cardDiscart.type === "terreno":
        target.stacks.terreno = cardDiscart;
        break;
      case cardDiscart.type === "defesa":
        target.stacks.defesa.push(cardDiscart);
        break;
      case cardDiscart.type === "orientação":
        if (
          !target.stacks.batalha.nomeCarta ||
          target.stacks.batalha.type === "liberação" ||
          target.stacks.batalha.nomeCarta === "Perdido"
        ) {
          target.stacks.batalha = cardDiscart;
        }
        break;

      //No caso em que o descarte é uma carta de contratempo
      case cardDiscart.type === "contratempo" &&
        target.stacks.batalha.type === "orientação":
        target.stacks.batalha = cardDiscart;
        break;
      //No caso em que o descarte é uma carta de liberação
      case cardDiscart.type === "liberação":
        switch (true) {
          case cardDiscart.nomeCarta === "Trabalho" &&
            target.stacks.batalha.nomeCarta === "Fim do Dinheiro":
            target.stacks.batalha = cardDiscart;
            break;
          case cardDiscart.nomeCarta === "Fuga" &&
            target.stacks.batalha.nomeCarta === "Povos Hostis":
            target.stacks.batalha = cardDiscart;
            break;
          case cardDiscart.nomeCarta === "Remédio" &&
            target.stacks.batalha.nomeCarta === "Epidemia":
            target.stacks.batalha = cardDiscart;
            break;
          default:
            finishDiscart = false;
            console.log(
              `"A carta ${cardDiscart.nomeCarta} não atende aos requisitos de descarte"`
            );
            break;
        }
        break;

        //Função que coloca carta de KM no seu devido monte
        function destinarCartaQuilometros(target, cardDiscart) {
          switch (true) {
            case cardDiscart.nomeCarta === "A pé":
              target?.stacks?.quilometros?.aPe?.push(cardDiscart);
              break;
            case cardDiscart.nomeCarta === "A cavalo":
              target?.stacks?.quilometros?.aCavalo?.push(cardDiscart);
              break;
            case cardDiscart.nomeCarta === "De trem":
              target?.stacks?.quilometros?.deTrem?.push(cardDiscart);
              break;
            case cardDiscart.nomeCarta === "De vapor":
              target?.stacks?.quilometros?.deVapor?.push(cardDiscart);
              break;
            case cardDiscart.nomeCarta === "De balão":
              target?.stacks?.quilometros?.deBalao?.push(cardDiscart);
              break;
            default:
              finishDiscart = false;
              console.log(
                `"A carta ${cardDiscart.nomeCarta} não atende aos requisitos de descarte"`
              );
              break;
          }
        }

      //Quando o descarte é uma carta de viajem (quilometragem)
      case cardDiscart.type > 0 &&
        target?.stacks?.batalha?.nomeCarta === "Orientação":
        switch (true) {
          case !target.stacks.terreno.nomeCarta:
            destinarCartaQuilometros(target, cardDiscart);
            break;
          case target.stacks.terreno.nomeCarta ===
            "Sem recursos de Transporte" && cardDiscart.nomeCarta === "A pé":
            destinarCartaQuilometros(target, cardDiscart);
            break;
          case target.stacks.terreno.nomeCarta === "Terra Civilizada" &&
            (cardDiscart.nomeCarta === "A pé" ||
              cardDiscart.nomeCarta === "A cavalo" ||
              cardDiscart.nomeCarta === "De balão"):
            destinarCartaQuilometros(target, cardDiscart);
            break;
          case target.stacks.terreno.nomeCarta === "Terra Selvagem" &&
            (cardDiscart.nomeCarta === "A pé" ||
              cardDiscart.nomeCarta === "A cavalo" ||
              cardDiscart.nomeCarta === "De balão"):
            destinarCartaQuilometros(target, cardDiscart);
            break;
          case target.stacks.terreno.nomeCarta === "Terra Civilizada" &&
            (cardDiscart.nomeCarta === "A pé" ||
              cardDiscart.nomeCarta === "A cavalo" ||
              cardDiscart.nomeCarta === "De balão" ||
              cardDiscart.nomeCarta === "De trem"):
            destinarCartaQuilometros(target, cardDiscart);
            break;
          case target.stacks.terreno.nomeCarta === "Mar" &&
            (cardDiscart.nomeCarta === "De vapor" ||
              cardDiscart.nomeCarta === "De balão"):
            destinarCartaQuilometros(target, cardDiscart);
            break;
          default:
            console.log(
              `"A carta ${cardDiscart.nomeCarta} não atende aos requisitos de descarte"`
            );
            finishDiscart = false;
            break;
        }
        break;
      default:
        console.log(
          `"A carta ${cardDiscart.nomeCarta} não atende aos requisitos de descarte"`
        );
        finishDiscart = false;
        break;
    }
  }
  if (finishDiscart) {
    player.handCards.splice(indexCardDiscart, 1);

    // Pela regra quem descarta uma defesa tem direito de comprar mais uma carta e descartar novamente
    if (cardDiscart.type === "defesa"){
      player.steps[1].drawCard = true

    } else {
      player.steps[0].waitOtherPlayer = true;
      player.steps[2].discart = false;
  
      enemyPlayer.steps[0].waitOtherPlayer = false;
      enemyPlayer.steps[1].drawCard = true;
    }
  }
}

function getDeck() {
  return deck;
}

module.exports = {
  descarteGeral,
  playersList,
  drawCard,
  jogadorConectado,
  jogadorDesconectado,
  inicioPartida,
  descarte,
};
