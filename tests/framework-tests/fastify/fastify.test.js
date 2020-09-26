'use strict'

const path = require('path');
const fastify = require('fastify')({ logger: false });

// Require the compiled version of GameGuard server.
const GameGuard = require('../../../build/index');

// We use the public folder to serve the game and the gameguard-client module 
// folder so serve that.
fastify.register(require('fastify-static'), { root: path.resolve(__dirname) });
fastify.register(require('fastify-static'), { root: path.resolve(__dirname, '..', '..', '..', 'node_modules', 'gameguard-client'), prefix: '/client/', decorateReply: false });

// Set the GameGuard server to use a latency check interval of 1000ms.
const gg = new GameGuard(fastify.server, { latencyCheckInterval: 1000 });

// When a client has successfully connected to the GameGuard server and has
// become a player, we log the player's id server side.
gg.playerConnected.add(player => console.log(`Player ${player.id} joined.`));

// When a player leaves and their connection to GameGuard is closed, we log
// their id server side.
gg.playerDisconnected.add(player => console.log(`Player ${player.id} left.`));

fastify.get('/', function (req, reply) {
    return reply.sendFile('index.html');
});

// Have the server listen on port 3000.
fastify.listen(3000, (err, address) => {
    if (err) throw err;
    console.log(`Listening on port 3000`);
});