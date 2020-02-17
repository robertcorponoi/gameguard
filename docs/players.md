# Players

The players module is responsible for managing the players connected to the server and dispatching signals during a player's lifecycle.

Table of Contents

- [Properties](#properties)
- [Signals](#signals)
- [API](#api)

## **Properties**

### **players**

Contains all of the players that are connected to the server.

```js
const players = gameguard.players.players;
```

## **Signals**

Since there is no exact timing with WebSockets, we rely on signals to know when things have occurred. After getting the Player Object from the signal you can use any method from the API section defined below on them. 

If you're new to signals check out [hypergiant](https://github.com/robertcorponoi/hypergiant) to see the signals that gameguard is using.

Each player has the following signals that can be responded to:

### **connected**

This is dispatched when the player has joined and their Player Object has been created by the server. This signal is dispatched with the client's player object. 

```js
gameguard.players.connected.add(player => {
  console.log(player);
});
```

### **disconnected**

This is dispatched when the player has left the server through either being disconnected, kicked, or banned. This signal is dispatched with the client's player object. 

```js
gameguard.players.disconnected.add(player => {
  console.log(player);
});
```

### **rejected**

This is dispatched when the player attempts to connect to the server but is kicked because they are banned. This signal is dispatched with the id of the player that was rejected.

```js
gameguard.players.rejected.add(playerId => {
  console.log(playerId);
});
```

### **kicked**

This is dispatched when the player has been kicked from the server. This signal is dispatched with the client's player object and the reason as to why they were kicked.

```js
gameguard.players.kicked.add((player, reason) => {
  console.log(player, reason);
});
```

### **banned**

This is dispatched when the player has been banned from the server. This signal is dispatched with the client's player object and the reason that they were banned.

```js
gameguard.players.banned.add((player, reason) => {
  console.log(player, reason);
});
```

### **timedOut**

This is dispatched when the player's latency has excedeed the value set for the `maxLatency` option and has been kicked.

```js
gameguard.players.timedOut.add((player) => {
  console.log(player);
});
```
