const express = require('express')
const cors = require('cors');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const port = process.env.PORT || 4000;
const { Server } = require("socket.io");

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS']
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});

io.on('connection', (socket) => {
  socket.on('user joined', name => {
    io.emit('chat', {
      user: 'bot',
      message: `${name} has joined the game`,
      id: uuidv4()
    });
  });

  socket.on('chat', chatData => {
    io.emit('chat', {
      ...chatData,
      id: uuidv4()
    });
  });

  socket.on('add inventory', invData => {
    io.emit('add inventory', {
      ...invData,
      id: uuidv4()
    });
  })

  socket.on('remove inventory', itemName => {
    io.emit('remove inventory', itemName);
  })

  socket.on('game state', stateName => {
    io.emit('game state', stateName);
  })
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
