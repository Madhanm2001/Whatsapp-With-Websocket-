import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);
  socket.emit('receive_message', '🟢 New client connected.');
  socket.emit('receive_message', `current client's count are ${io.engine.clientsCount}`);

  socket.on('send_message', (data) => {
    console.log('Madhan', data);
    socket.emit('receive_message from client', data);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

setInterval(() => {
  console.log('👥 Total Clients:', io.engine.clientsCount);
  io.emit('receive_message', `current client's count are ${io.engine.clientsCount}`);
}, 10000);

server.listen(4000, () => {
  console.log('🚀 Server running on http://localhost:4000');
});
