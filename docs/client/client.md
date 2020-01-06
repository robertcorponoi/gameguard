# GameGuard Client

The GameGuard client is used to communicate with the server to manage the game's players and states.

In order to use the client you have to include it in the html page that hosts the game. For example, you could accomplish it like so:

```js
// From a public folder you have defined or the reference to it in node_modules.
import GameGuardClient from 'node_modules/gameguard/gameguardclient.js';

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