import Hypergiant from 'hypergiant';
/**
 * A Player represents a client that has established a successful connection to GameGuard.
 *
 * The player is created after the client has established an id for them.
 */
export default class Player {
    /**
     * The id of assigned to this player by the client.
     *
     * @private
     *
     * @property {string}
     */
    private _id;
    /**
     * A reference to the WebSocket connection object for this player.
     *
     * @private
     *
     * @property {*}
     */
    private _socket;
    /**
     * A reference to the http request object for this player.
     *
     * @private
     *
     * @property {*}
     */
    private _request;
    /**
     * The most probably ip address for this player.
     *
     * @private
     *
     * @property {string}
     */
    private _ip;
    /**
     * The signal that is dispatched when this player is kicked.
     *
     * @private
     *
     * @property {Hypergiant}
     */
    private _kicked;
    /**
     * The signal that is dispatched when this player is banned.
     *
     * @private
     *
     * @property {Hypergiant}
     */
    private _banned;
    /**
     * Indicates whether this player's connection is still alive or not.
     *
     * @private
     *
     * @property {boolean}
     *
     * @default true
     */
    private _isAlive;
    /**
     * This players latency.
     *
     * @property {number}
     */
    latency: number;
    /**
     * The value returned from the ping setInterval call.
     *
     * @private
     *
     * @property {*}
     */
    private _pingIntervalId;
    /**
     * The value returned from the latency setInterval call.
     *
     * @private
     *
     * @property {*}
     */
    private _latencyIntervalId;
    /**
     * @param {string} id The id assigned to this player by the client.
     * @param {*} socket A reference to the WebSocket connection object for this player.
     * @param {*} request A reference to the http request object for this player.
     */
    constructor(id: string, socket: any, request: any);
    /**
     * Returns this player's websocket connection.
     *
     * @returns {*}
     */
    get socket(): any;
    /**
     * Returns the id of this player.
     *
     * @returns {string}
     */
    get id(): string;
    /**
     * Returns the ip address of this player.
     *
     * @returns {string}
     */
    get ip(): string;
    /**
     * Returns the onKick signal.
     *
     * @returns {Hypergiant}
     */
    get kicked(): Hypergiant;
    /**
     * Returns the onBan signal.
     *
     * @returns {Hypergiant}
     */
    get banned(): Hypergiant;
    /**
     * Sets the value from the ping setInterval call.
     *
     * @param {*} id The new id of the setInterval call.
     */
    set pingIntervalId(id: any);
    /**
     * Sets the value from the latency setInterval call.
     *
     * @param {*} interval The new id of the setInterval call.
     */
    set latencyIntervalId(id: any);
    /**
     * Sends a message to this Player.
     *
     * @param {string} type The type of message to send.
     * @param {string} contents The contents of the message to send. The contents can be an object but it must be stringified.
     */
    message(type: string, contents: string): void;
    /**
     * Closes this player's connection to the server.
     *
     * This also emits the `kick` event with the player object and the reason as parameters.
     *
     * @param {string} [reason=''] The reason as to why this player's connection was closed. This will override any reason set for `kicked` in the initialization options.
     */
    kick(reason?: string): void;
    /**
     * Closes this player's connection to the server and adds them on a banned player list so that they cannot connect
     * to the server again.
     *
     * This also emits the `ban` event with the player object, the ban reason, and their id or ip as parameters.
     *
     * @param {string} [reason=''] The reason as to why this player's connection was closed and banned. This will override any reason set for `banned` in the initialization options.
     */
    ban(reason?: string): void;
    /**
     * Pings the player and terminates their connection if they're not responding.
     */
    ping(): void;
    /**
     * When this client is messaged, check out the type of message and respond accordingly.
     *
     * @private
     *
     * @param {string} message The message sent from the client.
     */
    private _onmessage;
}
