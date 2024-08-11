// server.js
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// import das funções do jogo
const {
  playersList,
  descarteGeral,
  drawCard,

  jogadorConectado,
  jogadorDesconectado,

  inicioPartida,
  descarte,
} = require("./game-functions");

const app = express();
app.use(
  cors({
    origin: "*", // Certifique-se de que a origem corresponde à do frontend
    methods: ["GET", "POST"],
    credentials: true, // Permite cookies de credenciais (se necessário)
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Correspondência exata com a origem do frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // Quando um jogador novo se conecta
  socket.on("send_name", (name) => {
    console.log(`Usuário conectado: ${name} - ${socket.id}`);
    jogadorConectado(socket, name);

    // Confirma conexão para o frontend
    socket.emit("conexao_confirmada", socket.id);

    // Emite a lista atualizada de jogadores para todos os clientes
    if (playersList.length == 2) {
      io.emit("room_full");
      io.emit("players_list", playersList);
    }
    console.log("playersList a cada conexão: ", playersList);
  });

  //Escuta o inicio da partida
  socket.on("inicio_partida", () => {
    inicioPartida();
    refreshUsersInfo()
  });

  socket.on("pedido_playersList", () => {
    refreshUsersInfo();
    ("pedido_playersList recebido pelo game room")
  })

  function refreshUsersInfo(){
    io.emit("refresh_users_info", playersList, descarteGeral )
  }

  socket.on("disconnect", () => {
    jogadorDesconectado(socket);

    // Emite a lista atualizada de jogadores para todos os clientes
    io.emit("players_list", playersList);
    console.log("playersList depois do disconnect", playersList);
  });

  // Lida com a compra de carta
  socket.on("comprar_carta", () => {
    drawCard(socket)
    refreshUsersInfo()
  });

  // Descarte
  socket.on("descarte", (indexCardDiscart, choice) => {
    descarte(indexCardDiscart, choice, socket)
    refreshUsersInfo()
  })
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
