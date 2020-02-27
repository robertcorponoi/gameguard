import Hypergiant from 'hypergiant';
import Player from './Player';
import Options from '../options/Options';
import Storage from '../storage/Storage';
/**
 * The Players module handles managing players as a batch group.
 */
export default class Players {
    /**
     * A reference to the options passed to GameGuard on initialization.
     *
     * @private
     *
     * @property {Options}
     */
    private _options;
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
    private _players;
    /**
     * The signal that is dispatched when a player connects to the server.
     *
     * The data contained in this signal is: the player object.
     *
     * @private
     *
     * @property {Hypergiant}
     */
    private _connected;
    /**
     * The signal that is dispatched when a player disconnects from the server.
     *
     * The data contained in this signal is: the player object.
     *
     * @private
     *
     * @property {Hypergiant}
     */
    private _disconnected;
    /**
     * The signal that is dispatched when a player is rejected by the server due to them being banned.
     *
     * The data contained in this signal is: the id of the player that was rejected.
     *
     * @private
     *
     * @property {Hypergiant}
     */
    private _rejected;
    /**
     * The signal that is dispatched when a player is kicked from the server.
     *
     * The data contained in this signal is: the player object and the reason for the kick.
     *
     * @private
     *
     * @property {Hypergiant}
     */
    private _kicked;
    /**
     * The signal that is dispatched when a player is banned from the server.
     *
     * The data contained in this signal is: the player object and the reason for the ban.
     *
     * @private
     *
     * @property {Hypergiant}
     */
    private _banned;
    /**
     * The signal that is dispatched when a player's connection has timed out.
     *
     * @private
     *
     * @property {Hypergiant}
     */
    private _timedOut;
    /**
     * @param {Options} options A reference to the options passed to GameGuard on initialization.
     * @param {Storage} storage A reference to the Storage module.
     */
    constructor(options: Options, storage: Storage);
    /**
     * Returns all of the players connected to the server.
     *
     * @returns {Array<Player>}
     */
    get players(): Array<Player>;
    /**
     * Returns the player connected signal.
     *
     * @returns {Hypergiant}
     */
    get connected(): Hypergiant;
    /**
     * Returns the player disconnected signal.
     *
     * @returns {Hypergiant}
     */
    get disconnected(): Hypergiant;
    /**
     * Returns the player rejected signal.
     *
     * @returns {Hypergiant}
     */
    get rejected(): Hypergiant;
    /**
     * Returns the player kicked signal.
     *
     * @returns {Hypergiant}
     */
    get kicked(): Hypergiant;
    /**
     * Returns the player banned signal.
     *
     * @returns {Hypergiant}
     */
    get banned(): Hypergiant;
    /**
     * Returns the player timed out signal.
     *
     * @returns {Hypergiant}
     */
    get timedOut(): Hypergiant;
    /**
     * Adds a player to the list of connected players.
     *
     * This also dispatches the `connected` signal that contains the Player object as a parameter.
     *
     * @param {string} id The id of the client connecting to the server.
     * @param {*} socket The WebSocket connection object of the client.
     * @param {*} request The http request object of the client.
     */
    add(id: string, socket: any, request: any): void;
    /**
     * Automatically rejects a player when banned player attempst to connect.
     *
     * @param {string} id The id of the client connecting to the server.
     * @param {*} socket The WebSocket connection object of the client.
     */
    reject(id: string, socket: any): void;
    /**
     * Remove all listeners from all signals.
     */
    removeAllListeners(): void;
    /**
     * Removes a player from the list of connected players.
     *
     * This also dispatches the `disconnected` signal that contains the Player object as a parameter.
     *
     * @private
     *
     * @param {Player} player The player to remove from the list.
     */
    private _remove;
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
    private _onkick;
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
    private _onban;
    /**
     * When a player's latency exceeds the `maxLatency`, they are automatically kicked from the server.
     *
     * @private
     *
     * @param {Player} player The player that timed out.
     */
    private _ontimedout;
    /**
     * When a player recieves a message, it's processed here.
     *
     * @private
     *
     * @param {Player} player The player that received the message.
     * @param {ArrayBuffer} msg The message that was received.
     */
    private _onmessage;
    /**
     * Creates an interval on the player object for the heartbeat check.
     *
     * @private
     *
     * @param {Player} player The player to create the heartbeat check for.
     */
    private _createHeartbeatCheck;
    /**
     * Creates an interval on the player object for the latency check.
     *
     * @private
     *
     * @param {Player} player The player to create the latency check for.
     */
    private _createLatencyCheck;
}
