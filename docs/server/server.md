# GameGuard Server

Table of Contents

- [Initialization](#initialization)
- [Http Servers](#http-servers)
- [Players](#players)
- [Rooms](#rooms)
- [System](#system)

## **Initialization**

A new instance of GameGuard takes a mandatory http server as the first argument and options as the second. The http server has to be the one that is hosting the game and in turn, the client side version of GameGuard. A short guide on how to use the most common http servers with GameGuard can be found below.

| param  	| type        	| description                    	| default 	|
|--------	|-------------	|--------------------------------	|---------	|
| server 	| http.Server 	| The server instance to bind to 	|         	|

## **Http Servers**

GameGuard tries to be as unopinionated as possible and one of the ways it does this is by not locking you down to a specific http server for serving your client side game. Below are ways that you can implement GameGuard with various popular http frameworks.

[Examples for using GameGuard with various http server frameworks can be found here](./http-server-examples.md)

## **Players**

The Players module is used internally to create and manage player states and is usually never interacted with directly. Individual players however are a very big part of GameGuard and they can be interacted with in multiple ways. See the [players](./players.md) documentation for more information on players.

## **Rooms**

The Rooms module can be used to group players into 'rooms' if you want to manage or broadcast to players in that way. See the [rooms](./rooms.md) documentation for more information on rooms.

## **System**

The System module is used to manage the entire server as a whole including broadcasting messages to every single players connected to the server. See the [system](./system.md) documentation for more information on systems.