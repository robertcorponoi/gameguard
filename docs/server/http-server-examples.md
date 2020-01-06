### **fastify**

With fastify we're also using the `fastify-static` plugin to server the static html file that contains the game.

```js
'use strict'

const path = require('path');
const fastify = require('fastify')({ logger: true });

const GameGuard = require('gameguard');

// The directory that contains our html file and the game's javascript.
fastify.register(require('fastify-static'), { root: path.resolve(__dirname, 'public' });

// If you aren't using a CDN and including the gameguardclient on the front end, you can use the gameguardclient.js file in the gameguard folder in the node modules directory.
fastify.register(require('fastify-static'), { root: path.resolve(__dirname, '..', 'node_modules', 'gameguard'), prefix: '/client/', decorateReply: false });

const gg = new GameGuard(fastify.server);

fastify.get('/', async (request, reply) => reply.sendFile('index.html'));

fastify.listen(3000, (err, address) => {
  if (err) throw err;

  fastify.log.info(`server listening on ${address}`);
});
```

### **express**

```js
'use strict'

const path = require('path');
const express = require('express');
const app = express();

const GameGuard = require('gameguard');

// The directory that contains our html file and the game's javascript.
app.use(express.static(path.resolve(__dirname, 'public')));

// If you aren't using a CDN and including the gameguardclient on the front end, you can use the gameguardclient.js file in the gameguard folder in the node modules directory.
app.use(express.static(path.resolve(__dirname, '..', 'node_modules', 'gameguard')));

const gg = new GameGuard(app);

app.listen(3000, () => console.log('Listening on port 3000'));
```

### **koa**

```js
'use strict'

const path = require('path');
const Koa = require('koa');
const app = new Koa();

const GameGuard = require('gameguard');

// The directory that contains our html file and the game's javascript.
app.use(require('koa-static')(path.join(__dirname, 'public')));

// If you aren't using a CDN and including the gameguardclient on the front end, you can use the gameguardclient.js file in the gameguard folder in the node modules directory.
app.use(require('koa-static')(path.join(__dirname, 'public')));

const gameGuard = new GameGuard(app);

app.listen(3000);

console.log('Listening on port 3000');
```