'use strict'

const path = require('path');
const Koa = require('koa');
const app = new Koa();

const GameGuard = require('../../server/src/index');

const gameGuard = new GameGuard(app);

app.use(require('koa-static')(path.join(__dirname, '..', 'public')));

app.listen(3000);

console.log('Listening on port 3000');