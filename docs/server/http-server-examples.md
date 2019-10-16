### **fastify**

With fastify we're also using the `fastify-static` plugin to server the static html file that contains the game.

```js
'use strict'

const path = require('path');
const fastify = require('fastify')({ logger: true });

const GameGuard = require('../../server/src/index');

fastify.register(require('fastify-static'), { root: path.resolve(__dirname, '..') });

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

app.use(express.static(path.resolve(__dirname, '..', 'public')));

const GameGuard = require('../../server/src/index');

const gg = new GameGuard(app);

app.listen(3000, () => console.log('Listening on port 3000'));
```

### **koa**

```js
'use strict'

const path = require('path');
const Koa = require('koa');
const app = new Koa();

const GameGuard = require('../../server/src/index');

const gameGuard = new GameGuard(app);

app.use(require('koa-static')(path.join(__dirname, '..', 'public')));

app.listen(3000);

console.log('Listening on port 3000');
```