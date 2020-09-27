# **Player**

At it's core, GameGuard works around watching for clients trying to connect to the server and turning those clients into players. Once connected, players can be interacted with in forms of messaging, kicking, banning, or placing in rooms.

## **Table of Contents**

- [Signals](#signals)
- [Properties](#properties)
- [API](#api)

## **Signals**

### **playerConnected**

The `playerConnected` signal is dispatched from the base GameGuard object when a client connects to the server and becomes a player. This signal includes the Player object of the player that connected.

```js
gameguard.playerConnected.add(player => player.message('info', 'Hello there!'));
```

### **playerDisconnected**

The `playerDisconnected` signal is dispatched from the GameGuard object when a player disconnects from the server. This signal includes the Player object of the player that disconnected.

```js
gameguard.playerDisconnected.add(player => console.log(`player ${player.id} disconnected`));
```

### **playerRejected**

The `playerRejected` signal is dispatched from the GameGuard object when a client is rejected during connecting. Since the client got rejected before they became a player, most likely because they're banned, this signal includes the player object from the database.

```js
gameguard.playerRejected.add(player => console.log(`player ${player.id} rejected`));
```

## **Properties**

### **id**

The id of the player. The player's id is retrieved by the client on connection and stored in the client's cookies.

### **ip**

The most probably ip address of the player. the ip is retrieved from either the `x-forwarded-for` headers or from the remote address of the player's request header.

### **latency**

The latency between the server and client which is calculated every x milliseconds depending on the value of the `latencyCheckInterval` option.

## **API**

### **message**

Sends a message to the player.

| param   	| type   	| description                                                                  	| default 	|
|---------	|--------	|------------------------------------------------------------------------------	|---------	|
| type    	| string 	| The type of message this is. This helps you decipher messages on the client. 	|         	|
| contents 	| string 	| The contents of the message to send to this player.                            |         	|

### **kick**

Kick the player from the server. This ends their connection to the game server but they can join again by refreshing.

| param  	| type   	| description                                                                                                                                        	| default 	|
|--------	|--------	|----------------------------------------------------------------------------------------------------------------------------------------------------	|---------	|
| reason 	| string 	| The reason as to why this player was kicked from the server. This reason is sent to the client and from there you can use it to inform the player. 	|         	|

```js
gameguard.playerConnected.add(player => player.kick('cheating'));
```

### **ban**

Bans the player from the server. This ends their connection to the game server and sets their id/IP as banned so that they can't join again.

| param  	| type    	| description                                                                                                                                        	| default 	|
|--------	|---------	|----------------------------------------------------------------------------------------------------------------------------------------------------	|---------	|
| reason 	| string  	| The reason as to why this player was banned from the server. This reason is sent to the client and from there you can use it to inform the player. 	|         	|

```js
gameguard.playerConnected.add(player => player.ban('cheating'));
```