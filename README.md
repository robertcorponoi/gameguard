<div align="center">

# GameGuard

GameGuard is a NodeJS game server that can be used to manage the players connecting to your game, manage rooms and the players in them, and more.

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

**Note:** This is the post 1.0.0 version of GameGuard that has lots of breaking changes from the last version due to major simplification. All of the previous features still exist but the API has changed to be more simple and streamlined. GameGuard can now be used on it's own but it has been simplified in order to be able to be extended further to suit your needs.

**Table of Contents**

- [Install](#install)
- [Initialization](#initialization)
- [Operation](#operation)
- [Guides](#guides)
  - [Database](#database)

## **Install**

To install GameGuard you need the server side package (this one) and then a client-side package. Currently only [gameguard-client](https://github.com/robertcorponoi/gameguard-client) is supported but in the future there will be guides on creating your own client side solution to communicate with the GameGuard server.

To install GameGuard you can use:

```bash
$ npm install gameguard
```

and if you need gameguard-client, you can use:

```bash
$ npm install gameguard-client
```

**Note:** The documentation for gameguard-client will not be covered here but you can head over to the [gameguard-client documentation](https://github.com/robertcorponoi/gameguard-client#README.md) for client side usage.

## **Initialization**

To initialize GameGuard, you have to initialize it with a reference to a http or https server and an optional set of options.

| param                        | type        | description                                                                    | default   |
|------------------------------|-------------|--------------------------------------------------------------------------------|-----------|
| server                       | http.Server | A reference to the http server instance to bind to.                            |           |
| options                      | Object      |                                                                                |           |
| options.heartbeatInterval    | number      | The interval at which each player is pinged, in milliseconds.                  | 30000     |
| options.latencyCheckInterval | number      | The interval at which each player's latency is calculated, in milliseconds.    | 5000      |
| options.maxLatency           | number      | The maximum latency, in milliseconds, the player can have before being kicked. | 300       |

**Example:**

A basic example of initializing GameGuard this with my personal favorite http server, fastify, is as follows:

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

Here's an example of initializaing GamGuard with options:

```js
'use strict'

const path = require('path');
const fastify = require('fastify')({ logger: false });
const GameGuard = require('gameguard');

// Set the GameGuard server to use a latency check interval of 1000ms.
const gg = new GameGuard(fastify.server, { latencyCheckInterval: 1000 });

// Have the server listen on port 3000.
fastify.listen(3000, (err, address) => {
    if (err) throw err;
    console.log(`Listening on port 3000`);
});
```

Notice how we pass fastify's server instance to GameGuard so that GameGuard can use it to communicate with the client.

Let's also take a look how we can accomplish the same thing we did above but with express:

```js
'use strict'

const path = require('path');
const express = require('express');
const GameGuard = require('gameguard');

const app = express();

// Have the server listen on port 3000.
const server = app.listen(3000, () => console.log('Listening on port 3000'));

// Set the GameGuard server to use a latency check interval of 1000ms.
const gg = new GameGuard(server, { latencyCheckInterval: 1000 });
```

## **Operation**

Now let's talk about the operation of GameGuard:

1. The GameGuard server instance is created with a http server instance.

2. Now, the GameGuard server waits for a WebSocket connection from a page using the GameGuard client and in specific it waits for the client to send a message that contains the id of the player that connected.

3. Before the client becomes a player, the GameGuard server checks to see if the id of that client corresponds to a player in the database that is banned and if so their connection gets reject. Otherwise, the client is accepted and their player profile is created locally and updated in the database.

4. Everything is set up now. The player can be kicked, banned, messaged, or put into rooms.

## **Guides**

Since GameGuard is not a linear app and it's hard to go in order with what to document, we'll just go over the general aspect of each part of GameGuard and then link to the documentation for that module that goes in detail about it.

### **Database**

The GameGuard server uses the MongoDB to manage players with the mongoose package to manage the schemas and other operations. The database connection info has a default value of `mongodb://localhost:27017/gameguard` but you can configure the connection credentials in a `.env` file with a sample connection file provided as `.env.sample`. 

Check out the [database documentation](docs/database.md) for more specific database operations and how to create your own operations if you want to extend GameGuard.

### **Player**

At it's core, GameGuard works around watching for clients trying to connect to the server and turning those clients into players. Once connected, players can be interacted with in forms of messaging, kicking, banning, or placing in rooms.

Check out the [player documentation](docs/player.md) for more specific player operations and how to create your own operations if you want to extend GameGuard.

### **Room**

Rooms are used to group players together to perform similar actions together. For example, you can group players together in a room and easily send messages to all of them.

Check out the [room documentation](docs/room.md) for more specific room operations and how to create if your own operations if you want to extend GameGuard.
















## **Players**

At it's core, GameGuard works around taking clients and turning them into players.

To see all of the properties, signals, and methods available to use with players, check out the [player documentation](docs/players.md).

Once a player has connected or through outher signals that return a player object, you can interact with that player and perform actions such as kicking/banning. Check out the [individual player documentation](docs/player.md).

## **Rooms**

Rooms can be used to group players together so that you can more easily manage them and broadcast messages to all players in a room.

To see the properties, signals, and methods available to use with the Rooms modules such as creating or destroying rooms, check out the [rooms documentation](docs/rooms.md).

Once you create a room, you can use all of the properties and methods available for individual rooms on that create room. To see all of the properties, signals, and methods available to use on any room created through the Rooms module, check out the [room documentation](docs/room.md).

## **System**

System is used to perform actions that affect every player in the server, regardless of the room they are in.

To see all of the properties, signals, and methods available to use with the system, check out the [system documentation](docs/system.md).

## **Tests**

To run the tests for GameGuard, you can use:

```bash
$ npm run test
```

## **License**

MIT
