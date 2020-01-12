# System

The system module contains methods that affect all players and rooms.

Table of Contents

- [API](#api)

## **API**

### **broadcast**

Sends a message to all players in the server regardless of what room they are or are not in.

| param   	| type   	| description                                                                  	| default 	|
|---------	|--------	|------------------------------------------------------------------------------	|---------	|
| type    	| string 	| The type of message this is. This helps you decipher messages on the client. 	|         	|
| contents 	| string 	| The conents of the message to send to everyone.                                           	|         	|

```js
gameGuard.system.broadcast('info', 'Hello World!');
```