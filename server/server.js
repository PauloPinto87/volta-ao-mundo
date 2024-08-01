// server.js
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: "*", // Certifique-se de que a origem corresponde à do frontend
  methods: ["GET", "POST"],
  credentials: true // Permite cookies de credenciais (se necessário)
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Correspondência exata com a origem do frontend
    methods: ["GET", "POST"],
    credentials: true
  },
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data);
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
