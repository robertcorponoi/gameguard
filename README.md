<div align="center">

# GameGuard

GameGuard is a JavaScript game server for managing your game's players and state

</div>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/gameguard.svg?style=flat)](https://www.npmjs.com/package/gameguard)
[![Known Vulnerabilities](https://snyk.io/test/github/robertcorponoi/gameguard/badge.svg)](https://snyk.io/test/github/robertcorponoi/gameguard)
[![NPM downloads](https://img.shields.io/npm/dm/gameguard.svg?style=flat)](https://www.npmjs.com/package/gameguard)
<a href="https://badge.fury.io/js/gameguard"><img src="https://img.shields.io/github/issues/robertcorponoi/gameguard.svg" alt="issues" height="18"></a>
<a href="https://badge.fury.io/js/gameguard"><img src="https://img.shields.io/github/license/robertcorponoi/gameguard.svg" alt="license" height="18"></a>
[![Gitter](https://badges.gitter.im/gitterHQ/gitter.svg)](https://gitter.im/robertcorponoi)

</div>

## **Table of Contents**

- [Install](#install)
- [Usage](#usage)
- [Test](#test)

## **Install**

To install both the client and server side parts of Gameguard, you can use:

```bash
$ npm install gameguard
```

## **Usage**

GameGuard comes in two parts, the client side script and the server side script. The docs for each have been split to help keep things clear.

- [Server](docs/server/server.md)
- [Client](docs/client/client.md)

To be able to use GameGuard, you must include both the GameGuardClient script on the client side and then GameGuard on the server side. Examples of how to include these in their relevant areas are in the above docs.

## **Test**

Tests for the client are still evolving as the client's functionality expands but to run the tests for the server you can use:

```bash
$ npm run test:server
```

## **License**

MIT