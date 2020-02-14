'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hypergiant_1 = __importDefault(require("hypergiant"));
const Player_1 = __importDefault(require("./Player"));
/**
 * The Players module handles managing players as a batch group.
 */
class Players {
    /**
     * @param {Options} options A reference to the options passed to GameGuard on initialization.
     * @param {Storage} storage A reference to the Storage module.
     */
    constructor(options, storage) {
        /**
         * A reference to all of the players that are connected to the server.
         *
         * @private
         *
         * @property {Array<Player>}
         */
        this._players = [];
        /**
         * The signal that is dispatched when a player connects to the server.
         *
         * The data contained in this signal is: the player object.
         *
         * @private
         *
         * @property {Hypergiant}
         */
        this._connected = new hypergiant_1.default();
        /**
         * The signal that is dispatched when a player disconnects from the server.
         *
         * The data contained in this signal is: the player object.
         *
         * @private
         *
         * @property {Hypergiant}
         */
        this._disconnected = new hypergiant_1.default();
        /**
         * The signal that is dispatched when a player is rejected by the server due to them being banned.
         *
         * The data contained in this signal is: the id of the player that was rejected.
         *
         * @private
         *
         * @property {Hypergiant}
         */
        this._rejected = new hypergiant_1.default();
        /**
         * The signal that is dispatched when a player is kicked from the server.
         *
         * The data contained in this signal is: the player object and the reason for the kick.
         *
         * @private
         *
         * @property {Hypergiant}
         */
        this._kicked = new hypergiant_1.default();
        /**
         * The signal that is dispatched when a player is banned from the server.
         *
         * The data contained in this signal is: the player object and the reason for the ban.
         *
         * @private
         *
         * @property {Hypergiant}
         */
        this._banned = new hypergiant_1.default();
        this._options = options;
        this._storage = storage;
    }
    /**
     * Returns all of the players connected to the server.
     *
     * @returns {Array<Player>}
     */
    get players() { return this._players; }
    /**
     * Returns the player connected signal.
     *
     * @returns {Hypergiant}
     */
    get connected() { return this._connected; }
    /**
     * Returns the player disconnected signal.
     *
     * @returns {Hypergiant}
     */
    get disconnected() { return this._disconnected; }
    /**
     * Returns the player rejected signal.
     *
     * @returns {Hypergiant}
     */
    get rejected() { return this._rejected; }
    /**
     * Returns the player kicked signal.
     *
     * @returns {Hypergiant}
     */
    get kicked() { return this._kicked; }
    /**
     * Returns the player banned signal.
     *
     * @returns {Hypergiant}
     */
    get banned() { return this._banned; }
    /**
     * Adds a player to the list of connected players.
     *
     * This also dispatches the `connected` signal that contains the Player object as a parameter.
     *
     * @param {string} id The id of the client connecting to the server.
     * @param {*} socket The WebSocket connection object of the client.
     * @param {*} request The http request object of the client.
     */
    add(id, socket, request) {
        const player = new Player_1.default(id, socket, request);
        player.kicked.add((player, reason) => this._onkick(player, reason));
        player.banned.add((player, reason) => this._onban(player, reason));
        this._createHeartbeatCheck(player);
        this._createLatencyCheck(player);
        this._players.push(player);
        this.connected.dispatch(player);
    }
    /**
     * Automatically rejects a player when banned player attempst to connect.
     *
     * @param {string} id The id of the client connecting to the server.
     * @param {*} socket The WebSocket connection object of the client.
     */
    reject(id, socket) {
        socket.close(this._options.socketCloseInfo.rejected.code, this._options.socketCloseInfo.rejected.reason);
        this.rejected.dispatch(id);
    }
    /**
     * Remove all listeners from all signals.
     */
    removeAllListeners() {
        this.connected.removeAll();
        this.disconnected.removeAll();
        this.rejected.removeAll();
        this.kicked.removeAll();
        this.banned.removeAll();
    }
    /**
     * Removes a player from the list of connected players.
     *
     * This also dispatches the `disconnected` signal that contains the Player object as a parameter.
     *
     * @private
     *
     * @param {Player} player The player to remove from the list.
     */
    _remove(player) {
        this._players = this._players.filter((pl) => pl.id !== player.id);
        this.disconnected.dispatch(player);
    }
    /**
     * When a player is kicked, they are removed from the list of connected players.
     *
     * This also dispatches the `kick` signal that contains the player object and the reason they were kicked as parameters.
     *
     * @private
     *
     * @param {Player} player The player that was kicked.
     * @param {string} [reason] The reason as to why the player was kicked.
     */
    _onkick(player, reason) {
        const closeReason = reason ? reason : this._options.socketCloseInfo.kicked.reason;
        player.socket.close(this._options.socketCloseInfo.kicked.code, closeReason);
        this._remove(player);
        this.kicked.dispatch(player, reason);
    }
    /**
     * When a player is banned, they are removed from the list of connected players and added to a persistent banned players list.
     *
     * This also dispatches the `banned` signal that contains the player object and the reason thye were banned as parameters.
     *
     * @private
     *
     * @param {Player} player The player that was banned.
     * @param {string} [reason] The reason as to why the player was banned.
     */
    _onban(player, reason) {
        const banReason = reason ? reason : this._options.socketCloseInfo.banned.reason;
        player.socket.close(this._options.socketCloseInfo.banned.code, banReason);
        this._storage.ban(player.id);
        this._remove(player);
        this.banned.dispatch(player, reason);
    }
    /**
     * Creates an interval on the player object for the heartbeat check.
     *
     * @private
     *
     * @param {Player} player The player to create the heartbeat check for.
     */
    _createHeartbeatCheck(player) {
        player.pingIntervalId = setInterval(() => {
            player.ping();
        }, this._options.pingInterval);
    }
    /**
     * Creates an interval on the player object for the latency check.
     *
     * @private
     *
     * @param {Player} player The player to create the latency check for.
     */
    _createLatencyCheck(player) {
        player.pingIntervalId = setInterval(() => {
            const time = `${Date.now()}`;
            player.message('latency-ping', time);
        }, this._options.latencyCheckInterval);
    }
}
exports.default = Players;
