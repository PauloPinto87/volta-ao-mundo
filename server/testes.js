const newPlayer = {
  id: "socket.id",
  name: "name",
  logged: true,
  playing: false,
  handCards: [],
  steps: [
    { waitOtherPlayer: false },
    { drawCard: false },
    { discart: false },
  ],
  stacks: {
    defesa: [
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
    ],
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

newPlayer.stacks.defesa.map((carta)=> {
  console.log(carta.nomeCarta === "Rotas Alternativas")
})


