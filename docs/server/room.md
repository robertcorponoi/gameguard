# Rooms

A Room Object is returned whenever you create a new room using the [rooms](./rooms.md) module.

Table of Contents

- [Properties](#properties)
- [API](#api)

## **Properties**

### **name**

Returns the name of the room.

```js
const roomName = room1.name;
```

### **playerCount**

Returns the number of players currently in the room.

```js
const roomPlayerCount = room1.playerCount;
```

### **players**

Returns an Array of the Player Objects currently in the room.

```js
const roomPlayers = room1.players;
```

### **capacity**

Returns the maximum amount of players that can be in the room.

```js
const roomCapacity = room1.capacity;
```

### **capacity**

A setter property that allows you to set a new max capacity for the room. If the new capacity is lower than the current number of players in the room, an error will be thrown so it's recommended to wrap this in a try catch.

| param       	| type   	| description                         	| default 	|
|-------------	|--------	|-------------------------------------	|---------	|
| newCapacity 	| number 	| The new max capacity for this room. 	|         	|

```js
room1.capacity(20);
```

## **API**

### **add**

Adds a player to the room.

| param  	| type   	| description                    	| default 	|
|--------	|--------	|--------------------------------	|---------	|
| player 	| Player 	| The player to add to this room 	|         	|

```js
gameguard.players.on('player-joined', (player) => room1.add(player));
```

### **remove**

Removes a player from the room.

| param  	| type   	| description                         	| default 	|
|--------	|--------	|-------------------------------------	|---------	|
| player 	| Player 	| The player to remove from this room 	|         	|

```js
room1.remove(player);
```

### **clear**

Removes all players from the room.

```js
room1.clear();
```

### **broadcast**

Sends a message to every player in the room.

| param   	| type   	| description                                                                  	| default 	|
|---------	|--------	|------------------------------------------------------------------------------	|---------	|
| type    	| string 	| The type of message this is. This helps you decipher messages on the client. 	|         	|
| message 	| string 	| The message to send to this player.                                          	|         	|