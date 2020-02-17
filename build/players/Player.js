'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hypergiant_1 = __importDefault(require("hypergiant"));
const Message_1 = __importDefault(require("../message/Message"));
/**
 * A Player represents a client that has established a successful connection to GameGuard.
 *
 * The player is created after the client has established an id for them.
 */
class Player {
    /**
     * @param {string} id The id assigned to this player by the client.
     * @param {*} socket A reference to the WebSocket connection object for this player.
     * @param {*} request A reference to the http request object for this player.
     */
    constructor(id, socket, request) {
        /**
         * The signal that is dispatched when this player is kicked.
         *
         * @private
         *
         * @property {Hypergiant}
         */
        this._kicked = new hypergiant_1.default();
        /**
         * The signal that is dispatched when this player is banned.
         *
         * @private
         *
         * @property {Hypergiant}
         */
        this._banned = new hypergiant_1.default();
        /**
         * Indicates whether this player's connection is still alive or not.
         *
         * @private
         *
         * @property {boolean}
         *
         * @default true
         */
        this._isAlive = true;
        /**
         * This players latency.
         *
         * @property {number}
         */
        this.latency = 0;
        this._id = id;
        this._socket = socket;
        this._request = request;
        this._ip = this._request.headers['x-forwarded-for'] || this._request.connection.remoteAddress;
        this._socket.on('message', (message) => this._onmessage(message));
        this._socket.on('pong', () => this._isAlive = true);
    }
    /**
     * Returns this player's websocket connection.
     *
     * @returns {*}
     */
    get socket() { return this._socket; }
    /**
     * Returns the id of this player.
     *
     * @returns {string}
     */
    get id() { return this._id; }
    /**
     * Returns the ip address of this player.
     *
     * @returns {string}
     */
    get ip() { return this._ip; }
    /**
     * Returns the onKick signal.
     *
     * @returns {Hypergiant}
     */
    get kicked() { return this._kicked; }
    /**
     * Returns the onBan signal.
     *
     * @returns {Hypergiant}
     */
    get banned() { return this._banned; }
    /**
     * Sets the value from the ping setInterval call.
     *
     * @param {*} id The new id of the setInterval call.
     */
    set pingIntervalId(id) { this._pingIntervalId = id; }
    /**
     * Sets the value from the latency setInterval call.
     *
     * @param {*} interval The new id of the setInterval call.
     */
    set latencyIntervalId(id) { this._latencyIntervalId = id; }
    /**
     * Sends a message to this Player.
     *
     * @param {string} type The type of message to send.
     * @param {string} contents The contents of the message to send. The contents can be an object but it must be stringified.
     */
    message(type, contents) {
        const message = new Message_1.default(type, contents);
        const messageToString = JSON.stringify(message);
        this._socket.send(messageToString);
    }
    /**
     * Closes this player's connection to the server.
     *
     * This also emits the `kick` event with the player object and the reason as parameters.
     *
     * @param {string} [reason=''] The reason as to why this player's connection was closed. This will override any reason set for `kicked` in the initialization options.
     */
    kick(reason = '') {
        this.kicked.dispatch(this, reason);
    }
    /**
     * Closes this player's connection to the server and adds them on a banned player list so that they cannot connect
     * to the server again.
     *
     * This also emits the `ban` event with the player object, the ban reason, and their id or ip as parameters.
     *
     * @param {string} [reason=''] The reason as to why this player's connection was closed and banned. This will override any reason set for `banned` in the initialization options.
     */
    ban(reason = '') {
        this.banned.dispatch(this, reason);
    }
    /**
     * Pings the player and terminates their connection if they're not responding.
     */
    ping() {
        if (!this._isAlive)
            return this.kick('Not responding');
        this._isAlive = false;
        this._socket.ping(() => { });
    }
    /**
     * When this client is messaged, check out the type of message and respond accordingly.
     *
     * @private
     *
     * @param {string} message The message sent from the client.
     */
    _onmessage(message) {
        /*const messageParsed: any = JSON.parse(message);
    
        const msg: Message = new Message(messageParsed.type, messageParsed.contents);
    
        switch (msg.type) {
          case 'latency-pong':
            const previous: number = parseInt(msg.contents);
            const current: number = Date.now();
    
            this._latency = (current - previous) / 2;
    
            this.message('latency', `${this.latency}`);
            break;
        }*/
    }
}
exports.default = Player;
