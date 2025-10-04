const { Server } = require('socket.io');
const express = require('express');
const { createServer } = require('http');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = createServer(app);
console.log(process.env.FRONTEND_CHAT_APP_BACKEND_URL);
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_CHAT_APP_BACKEND_URL],

    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: false
  }
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);
  
  // Send welcome message to newly connected user
  socket.emit('message', { 
    text: 'Welcome to the chat!', 
    user: 'System',
    timestamp: new Date().toISOString()
  });
  
  // Handle incoming messages
  socket.on('message-send', (message) => {
    io.emit('message', message);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
  });
});


server.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
  console.log('Chat server ready to accept connections!');
});