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

**Note:** As of 0.7.0 gameguard and gameguard-client installs that match major and minor versions will be guaranteed to work with each other.

**Note:** As of 0.5.1 support for mongodb has been added but support for a local database has been deprecated. In the next storage update, support for mysql will be added. 

**Final Note:** Since gameguard is pre 1.0.0, there are high chances of a breaking change with each update. Once gameguard enters 1.0.0 this will be normalized.

This is mostly due to pitfalls of local storage options and will not be re-implemented unless there is enough support for it. Please feel free to open an issue if you feel like you have a good case for it being re-implemented. 

**Table of Contents**

- [Install](#install)
- [Initialization](#initialization)
- [Databases](#databases)
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

To initialize GameGuard, you have to initialize it with a reference to a http or https server and an optional set of options.

| param | type | description | default |
|-------|------|-------------|---------|
| server | http.Server | A reference to the http server instance to bind to. | |
| options | Object | | |
| options.dbType | string | The type of database to use. Current supported options are 'mongodb' and 'mysql' | 'mongodb' |
| options.pingInterval | number | The interval at which each player is pinged, in milliseconds. | 30000 |
| options.latencyCheckInterval | number | The interval at which each player's latency is calculated, in milliseconds. Note that this is a minimum check interval, checks might be sent more often with messages to converse resources but the checks will happen at least every x milliseconds as specified here. | 5000 |

and example of doing this with my personal favorite http server, fastify, is as follows:

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

## **Databases**

Older versions of gameguard would allow you to use a local file as a database. However, that has since been removed (maybe temporairly) as it was causing issues and now you have the option to use mysql or mongodb.

The option for the type of database to use is defined as an initialization option as shown above. For specific connection information such as host, port, user, etc. you must create a `.env` file defining the values.

A good starting point for creating a `.env` file is the `.sample.env` file. This file highlights all of the variables that can be defined in a `.env` file and their default values that are used if none are specified.

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
