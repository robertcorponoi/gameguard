'use strict'

const path = require('path');
const fastify = require('fastify')({ logger: false });

const GameGuard = require('../../server/src/index');

fastify.register(require('fastify-static'), { root: path.resolve(__dirname, '..', 'public'), decorateReply: false });

fastify.register(require('fastify-static'), { root: path.resolve(__dirname, '..', '..', 'client'), prefix: '/client/', decorateReply: false });

const gg = new GameGuard(fastify.server);

gg.players.on('player-joined', (player) => {

  console.log(player);

});

fastify.get('/', async (request, reply) => reply.sendFile('index.html'));

fastify.listen(3000, (err, address) => {

  if (err) throw err;

  fastify.log.info(`server listening on ${address}`);

  console.log(`server listening on ${address}`);

});