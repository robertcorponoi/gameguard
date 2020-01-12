# Rooms

Rooms can be used to group players together based on your game's needs. When players are in a room you can manage them together and broadcast messages to every player in the room. After you create a room it can be interacted with directly, unlike players which rely on events.

The rooms module can be accessed by `gameguard.rooms`.

Table of Contents

- [Properties](#properties)
- [API](#api)

## **Properties**

### **created**

This getter returns all of the rooms that have been created.

```js
const rooms = gameguard.rooms.created;
```

## **API**

### **create**

Creates a new room and returns it so that [room](./room.md) actions can be taken on it. See the [room](./room.md) documentation to see what you can do with the individual rooms.

| param    	| type   	| description                                            	| default  	|
|----------	|--------	|--------------------------------------------------------	|----------	|
| name     	| string 	| The name of this room                                  	|          	|
| capacity 	| number 	| The maximum number of players that can be in this room 	| Infinity 	|

```js
// Creating a room named 'room1' with a maximum capacity of 10 players.
const room1 = gameguard.rooms.create('room1', 10);
```

### **destroy**

Destroys a room and removes all references to it.

| param 	| type   	| description                     	| default 	|
|-------	|--------	|---------------------------------	|---------	|
| name  	| string 	| The name of the room to destroy 	|         	|

```js
// Destroy the room we created above.
gameguard.rooms.destroy('room1');
```