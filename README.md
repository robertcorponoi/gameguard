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

**Note About Logging:** For now, GameGuard has no logging capability. I've gone back and forth about implementing logging but I've found it to be so customizable it would be much easier for the end user to implement using signals but if there's enough requests then logging can be implemented to be a core part of GameGuard.

**Table of Contents**

- [Install](#install)
- [Initialization](#initialization)
- [Operation](#operation)
- [Docs](#docs)
  - [Database](#database)
  - [Players](#players)
  - [Rooms](#rooms)
  - [Global](#global)
- [Tests](#tests)

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

| param                           | type        | description                                                                    | default                   |
|---------------------------------|-------------|--------------------------------------------------------------------------------|---------------------------|
| server                          | http.Server | A reference to the http server instance to bind to.                            |                           |
| options                         | Object      |                                                                                |                           |
| options.heartbeatInterval       | number      | The interval at which each player is pinged, in milliseconds.                  | 30000                     |
| options.latencyCheckInterval    | number      | The interval at which each player's latency is calculated, in milliseconds.    | 5000                      |
| options.maxLatency              | number      | The maximum latency, in milliseconds, the player can have before being kicked. | 300                       |
| options.mongodbConnectionString | string      | The connection string to use to connect to mongodb.                            | mongodb://localhost:27017 |

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

## **Docs**

Since GameGuard is not a linear app and it's hard to go in order with what to document, we'll just go over the general aspect of each part of GameGuard and then link to the documentation for that module that goes in detail about it.

### **Database**

The GameGuard server uses the MongoDB to manage players with the mongoose package to manage the schemas and other operations. The database connection info has a default value of `mongodb://localhost:27017/gameguard` but you can configure the connection credentials in a `.env` file with a sample connection file provided as `.env.sample`. 

Check out the [database documentation](docs/database.md) for more specific database operations.

### **Players**

At it's core, GameGuard works around watching for clients trying to connect to the server and turning those clients into players. Once connected, players can be interacted with in forms of messaging, kicking, banning, or placing in rooms.

Check out the [player documentation](docs/player.md) for more specific player operations.

### **Rooms**

Rooms are used to group players together to perform similar actions together. For example, you can group players together in a room and easily send messages to all of them.

Check out the [room documentation](docs/room.md) for more specific room operations.

## **Global**

There are a few actions in GameGuard that are global and affect all players connected to the GameGuard server regardless of the rooms they are in.

Check out the [global documentation](docs/global.md) for more specific global operations.

## **Tests**

To run the tests for GameGuard server, you can use:

```bash
$ npm run test
```

## **License**

MIT
