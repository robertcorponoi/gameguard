'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The System module handles system-wide events and actions that apply to all players connected to the server.
 */
class System {
    /**
     * @param {Players} players A reference to the players module.
     */
    constructor(players) {
        this._players = players;
    }
    /**
     * Sends a message to every player in every room.
     *
     * @param {string} type The type of message to send.
     * @param {string} contents The contents of the message to send. The contents can be an object but it must be stringified.
     */
    broadcast(type, contents) {
        this._players.connected.map((player) => player.message(type, contents));
    }
}
exports.default = System;
