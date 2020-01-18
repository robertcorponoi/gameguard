/// <reference types="node" />
import events from 'events';
import Player from './Player';
import Storage from '../storage/Storage';
/**
 * The Players module handles managing players as a batch group.
 */
export default class Players extends events.EventEmitter {
    /**
     * A reference to the Storage module.
     *
     * @private
     *
     * @property {Storage}
     */
    private _storage;
    /**
     * A reference to all of the players that are connected to the server.
     *
     * @private
     *
     * @property {Array<Player>}
     */
    private _connected;
    /**
     * @param {Storage} storage A reference to the Storage module.
     */
    constructor(storage: Storage);
    /**
     * Returns all of the players connected to the server.
     *
     * @returns {Array<Player>}
     */
    get connected(): Array<Player>;
    /**
     * Adds a player to the list of connected players.
     *
     * This also emits the `player-connected` event that contains the Player object as a parameter.
     *
     * @param {string} id The id of the client connecting to the server.
     * @param {*} socket The WebSocket connection object of the client.
     * @param {*} request The http request object of the client.
     */
    add(id: string, socket: any, request: any): void;
    /**
     * Removes a player from the list of connected players.
     *
     * This also emits the `player-disconnected` event that contains the Player object as a parameter.
     *
     * @private
     *
     * @param {Player} player The player to remove from the list.
     */
    private _remove;
    /**
     * When a player is kicked, they are removed from the list of connected players.
     *
     * This also emits a `player-kicked` event that contains the player object and the reason they were kicked as parameters.
     *
     * @private
     *
     * @param {Player} player The player that was kicked.
     * @param {string} reason The reason as to why the player was kicked.
     */
    private _onkick;
    /**
     * When a player is banned, they are removed from the list of connected players and added to a persistent banned players list.
     *
     * This also emits a `player-banned` event that contains the player object and the reason thye were banned as parameters.
     *
     * @private
     *
     * @param {Player} player The player that was banned.
     * @param {string} reason The reason as to why the player was banned.
     */
    private _onban;
}
