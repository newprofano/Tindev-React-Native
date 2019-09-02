const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
  const { user } = socket.handshake.query;

  console.log(user, socket.id);

  connectedUsers[user] = socket.id;
});
mongoose.connect(
 // add string de conexão ao banco de dados,
  { useNewUrlParser: true }
);
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());
app.use(bodyParser.json());

app.use(routes);

server.listen(3333);
