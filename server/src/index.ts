import express from "express";
import { Server } from "socket.io";
import http from "http";


const app = express();
const server = http.createServer(app);

const socketIO = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const selfTalkIONameSpace=socketIO.of('/selftalk-io')

selfTalkIONameSpace.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  setTimeout(() => {
    socket.emit('receive_message', `Welcome! You are connected as ${socket.id}`);
    socket.emit('receive_message', `active client's count ${socketIO.engine.clientsCount}`);
  }, 100);

  socket.broadcast.emit('receive_message', `🟢 A new user has joined the chat.`);

  socket.on('send_message', (data) => {
    socket.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

setInterval(() => {
  selfTalk.emit('receive_message', `active client's count ${socketIO.engine.clientsCount}`);
}, 10000);


server.listen(4000, () => {
  console.log('🚀 Server running on http://localhost:4000');
});
