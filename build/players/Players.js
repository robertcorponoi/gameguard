'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const Player_1 = __importDefault(require("./Player"));
/**
 * The Players module handles managing players as a batch group.
 */
class Players extends events_1.default.EventEmitter {
    /**
     * @param {Storage} storage A reference to the Storage module.
     */
    constructor(storage) {
        super();
        /**
         * A reference to all of the players that are connected to the server.
         *
         * @private
         *
         * @property {Array<Player>}
         */
        this._connected = [];
        this._storage = storage;
    }
    /**
     * Returns all of the players connected to the server.
     *
     * @returns {Array<Player>}
     */
    get connected() { return this._connected; }
    /**
     * Adds a player to the list of connected players.
     *
     * This also emits the `player-connected` event that contains the Player object as a parameter.
     *
     * @param {string} id The id of the client connecting to the server.
     * @param {*} socket The WebSocket connection object of the client.
     * @param {*} request The http request object of the client.
     */
    add(id, socket, request) {
        const player = new Player_1.default(id, socket, request);
        player.on('kick', (player, reason) => this._onkick(player, reason));
        player.on('ban', (player, reason) => this._onban(player, reason));
        this._connected.push(player);
        this.emit('player-connected', player);
    }
    /**
     * Removes a player from the list of connected players.
     *
     * This also emits the `player-disconnected` event that contains the Player object as a parameter.
     *
     * @private
     *
     * @param {Player} player The player to remove from the list.
     */
    _remove(player) {
        this._connected = this._connected.filter((pl) => pl.id !== player.id);
        this.emit('player-disconnected', player);
    }
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
    _onkick(player, reason) {
        this._remove(player);
        this.emit('player-kicked', player, reason);
    }
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
    _onban(player, reason) {
        this._storage.ban(player.id);
        this._remove(player);
        this.emit('player-banned', player, reason);
    }
}
exports.default = Players;
