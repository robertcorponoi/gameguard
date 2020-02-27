'use strict'

const path = require('path');
const express = require('express');
const app = express();

/**
 * Specify the directory that contains the static files that should be served.
 */
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, '..', '..', '..', 'gameguard-client')));
//app.use(express.static(path.resolve(__dirname, '..', '..', 'node_modules', 'gameguard-client')));

const GameGuard = require('../../build/index');

/**
 * Start the express server.
 */
const server = app.listen(3000, () => console.log('Listening on port 3000'));

/**
 * Set the database to use mongodb and the ping interval to 5000 so we can see it in action.
 */
const options = {
  dbType: 'mongodb',
  pingInterval: 1000,
  latencyCheckInterval: 1000
};

const gg = new GameGuard(server, options);

gg.players.connected.add(player => {
  console.log(player.id);
});

/**
 * When a player leaves, log it to the console.
 */
gg.players.disconnected.add(player => {
  //  console.log('PLAYER LEFT', player.id);
});

/*gg.players.on('player-kicked', (player, reason) => {
  console.log('PLAYER KICKED', player.id, reason);
});*/

/*gg.players.on('player-banned', (player, reason) => {
  console.log('PLAYER BANNED', player.id, reason);
});*/
