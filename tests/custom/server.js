'use strict'

const path = require('path');
const express = require('express');
const app = express();

/**
 * Specify the directory that contains the static files that should be served.
 */
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, '..', '..', 'node_modules', 'gameguard-client')));

const GameGuard = require('../../build/index'); 

/**
 * Start the express server.
 */
const server = app.listen(3000, () => console.log('Listening on port 3000'));

/**
 * Start an instance of GameGuard with the express server.
 */
const gg = new GameGuard(server);

/**
 * When a player joins, log it to the console.
 */
gg.players.on('player-connected', (player) => {
  console.log('PLAYER JOINED', player);
});

/**
 * When a player leaves, log it to the console.
 */
gg.players.on('player-disconnected', (player) => {
  console.log('PLAYER LEFT', player.id);
});

/*gg.players.on('player-kicked', (player, reason) => {
  console.log('PLAYER KICKED', player.id, reason);
});*/

/*gg.players.on('player-banned', (player, reason) => {
  console.log('PLAYER BANNED', player.id, reason);
});*/
