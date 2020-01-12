### **fastify**

With fastify we're also using the `fastify-static` plugin to server the static html file that contains the game.

```js
'use strict'

const path = require('path');
const fastify = require('fastify')({ logger: true });

const GameGuard = require('gameguard');

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

const gameGuard = new GameGuard(app);

app.listen(3000);

console.log('Listening on port 3000');
```