# GameGuard Client

The GameGuard client doesn't offer as much as the server at this moment but it can be used to listen to events and respond to them accordingly.

Table of Contents

- [Initialization](#initialization)
- [Events](#events)

## **Initialization**

To initialize the client, use:

```js
import GameGuardClient from './path/to/gameguardclient.js';

const ggc = new GameGuardClient();

ggc.on('open', (playerId) => {

  // playerId is the id that was created for the player.
  console.log(playerId);

});

ggc.on('message', (message) => {

  // The message object contains the type of message and the contents of the message.
  console.log(message.type, message.content);

});

ggc.on('close', (reason) => {

  // reason contains the reason that the connection was closed, if one was provided server side.
  console.log(reason);

});
```