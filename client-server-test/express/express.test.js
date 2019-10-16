'use strict'

const path = require('path');
const express = require('express');
const app = express();

// const http = require('http');
// const server = http.createServer(app);

app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(express.static(path.resolve(__dirname, '..', '..', 'client')));

const GameGuard = require('../../server/src/index');

const server = app.listen(3000, () => console.log('Listening on port 3000'));

const gg = new GameGuard(server);

gg.players.on('player-joined', (player) => {

  setTimeout(() => {

    player.ban('cheater');

  }, 1000);

});

gg.players.on('player-left', (player) => {

  console.log('PLAYER LEFT', player.id);

});

gg.players.on('player-kicked', (player, reason) => {

  console.log('PLAYER KICKED', player.id, reason);

});

gg.players.on('player-banned', (player, reason) => {

  console.log('PLAYER BANNED', player.id, reason);

});