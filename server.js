const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS for GitHub Pages frontend
app.use(cors({
  origin: ["https://sahilverma1104.github.io/Real"],
  methods: ["GET", "POST"]
}));

const io = new Server(server, {
  cors: {
    origin: ["https://sahilverma1104.github.io/Real"],
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on('send_message', (data) => {
    // Add server-side ID and broadcast
    const serverMessage = {
      ...data,
      id: data.tempId // Use the temporary ID from client
    };
    io.in(data.room).emit('receive_message', serverMessage);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

server.listen(3001, () => {
  console.log('SERVER RUNNING');
});
