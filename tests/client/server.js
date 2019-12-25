'use strict'

const path = require('path');
const fastify = require('fastify')({ logger: true });

const GameGuard = require('../../server/src/index');

fastify.register(require('fastify-static'), { root: path.resolve(__dirname) });

const gg = new GameGuard(fastify.server);

setTimeout(() => {

  gg.system.broadcast('info', 'hello world');

  console.log(gg.players._players);

}, 5000);

fastify.get('/', async (request, reply) => reply.sendFile('index.html'));

fastify.listen(3000, (err, address) => {

  if (err) throw err;

  fastify.log.info(`server listening on ${address}`);

});