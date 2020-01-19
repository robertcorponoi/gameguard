<div align="center">

# GameGuard

GameGuard is a JavaScript game server for managing your game's players and state

</div>

<div align="center">

  [![NPM version](https://img.shields.io/npm/v/gameguard.svg?style=flat)](https://www.npmjs.com/package/gameguard)
  [![Known Vulnerabilities](https://snyk.io/test/github/robertcorponoi/gameguard/badge.svg)](https://snyk.io/test/github/robertcorponoi/gameguard)
  ![npm](https://img.shields.io/npm/dt/gameguard)
  [![NPM downloads](https://img.shields.io/npm/dm/gameguard.svg?style=flat)](https://www.npmjs.com/package/gameguard)
  <a href="https://badge.fury.io/js/gameguard"><img src="https://img.shields.io/github/issues/robertcorponoi/gameguard.svg" alt="issues" height="18"></a>
  <a href="https://badge.fury.io/js/gameguard"><img src="https://img.shields.io/github/license/robertcorponoi/gameguard.svg" alt="license" height="18"></a>
  [![Gitter](https://badges.gitter.im/gitterHQ/gitter.svg)](https://gitter.im/robertcorponoi)

</div>

**Note:** As of 0.5.1 support for mongodb has been added but support for a local database has been deprecated. As of the next version support for mysql has been added.

This is mostly due to pitfalls of local storage options and will not be re-implemented unless there is enough support for it. Feel free to voice your opinion about this as I love to hear other people's ponit of view on topics like this.

**Table of Contents**

- [Install](#install)
- [Initialization](#initialization)
- [Players](#players)
- [Rooms](#rooms)
- [System](#system)
- [Tests](#tests)

## **Install**

To install GameGuard you need the server side package (this one) and then a client-side package. Currently only [gameguard-client](https://github.com/robertcorponoi/gameguard-client) is supported but in the future there will be guides on creating your own client side solution to communicate with GameGuard.

To install GameGuard you can use:

```bash
$ npm install gameguard
```

and if you need gameguard-client, you can use:

```bash
$ npm install gameguard-client
```

These used to be one package originally but it was harder to maintain and bundle both of them so they have been split up.

**Note:** The documentation for gameguard-client will not be covered here but you can head over to the [gameguard-client documentation](https://github.com/robertcorponoi/gameguard-client#README.md) for client side usage.

## **Initialization**

To initialize GameGuard, you have to initialize it with a reference to a http or https server.

and example of doing this with my personal favorite, fastify, is as follows:

```js
'use strict'

const path = require('path');
const fastify = require('fastify')({ logger: true });

const GameGuard = require('gameguard');

const gg = new GameGuard(fastify.server);

fastify.listen(3000, (err, address) => {
  if (err) throw err;

  fastify.log.info(`server listening on ${address}`);
});
```

Notice how we pass fastify's server instance to GameGuard so that GameGuard can use it to communicate with the client.

The [http-server-examples docs](docs/http-server-examples.md) describe how you can use easily use GameGuard with different server frameworks such as fastify, express, and koa.

## **Players**

At it's core, GameGuard works around taking clients and turning them into players.

To see all of the properties, events, and methods available to use with players, check out the [player documentation](docs/players.md).

## **Rooms**

Rooms can be used to group players together so that you can more easily manage them and broadcast messages to all players in a room.

To see the properties, events, and methods available to use with the Rooms modules such as creating or destroying rooms, check out the [rooms documentation](docs/rooms.md).

Once you create a room, you can use all of the properties and methods available for individual rooms on that create room. To see all of the properties, events, and methods available to use on any room created through the Rooms module, check out the [room documentation](docs/room.md).

## **System**

System is used to perform actions that affect every player in the server, regardless of the room they are in.

To see all of the properties, events, and methods available to use with the system, check out the [system documentation](docs/system.md).

## **Tests**

To run the tests for GameGuard, you can use:

```bash
$ npm run test
```

## **License**

MIT
