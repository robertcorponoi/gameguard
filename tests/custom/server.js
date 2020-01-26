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

const options = { dbType: 'mysql' };

/**
 * Start an instance of GameGuard with the express server.
 */
const gg = new GameGuard(server, options);

setTimeout(() => {
    gg._storage._getBanned().then((banned) => console.log(banned));
}, 4000);

/**
 * When a player joins, log it to the console.
 */
gg.players.on('player-connected', (player) => {
  setTimeout(() => {
    gg._storage.ban(player.id);

    setTimeout(() => {
      gg._storage._getBanned().then((bannedZ) => console.log(banned));
    }, 5000);
    //console.log('banning...');
    //player.ban('wtf');
//    gg._storage._getBanned().then((banned) => console.log(banned));
  }, 5000);
  // console.log('PLAYER JOINED', player.id, player._id);
});

/**
 * When a player leaves, log it to the console.
 */
gg.players.on('player-disconnected', (player) => {
  //  console.log('PLAYER LEFT', player.id);
});

/*gg.players.on('player-kicked', (player, reason) => {
  console.log('PLAYER KICKED', player.id, reason);
});*/

/*gg.players.on('player-banned', (player, reason) => {
  console.log('PLAYER BANNED', player.id, reason);
});*/
