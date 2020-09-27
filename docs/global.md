# **Global**

There are a few actions in GameGuard that are global and affect all players connected to the GameGuard server regardless of the rooms they are in.

## **Table of Contents**

- [API](#api)

## **API**

### **broadcast**

Sends a message to all players connected to the GameGuard server.

| param   	| type   	| description                                                                  	| default 	|
|---------	|--------	|------------------------------------------------------------------------------	|---------	|
| type    	| string 	| The type of message this is. This helps you decipher messages on the client. 	|         	|
| contents 	| string 	| The contents of the message to send to all of the players.                    |         	|