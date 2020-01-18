'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const Message_1 = __importDefault(require("../message/Message"));
/**
 * A Player represents a client that has established a successful connection to GameGuard.
 *
 * The player is created after the client has established an id for them.
 */
class Player extends events_1.default.EventEmitter {
    /**
     * @param {string} id The id assigned to this player by the client.
     * @param {*} socket A reference to the WebSocket connection object for this player.
     * @param {*} request A reference to the http request object for this player.
     */
    constructor(id, socket, request) {
        super();
        this._id = id;
        this._socket = socket;
        this._request = request;
        this._ip = this._request.headers['x-forwarded-for'] || this._request.connection.remoteAddress;
    }
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
     * @param {string} [reason=''] The reason as to why this player's connection was closed.
     */
    kick(reason = '') {
        this._socket.terminate(reason);
        this.emit('kick', this, reason);
    }
    /**
     * Closes this player's connection to the server and adds them on a banned player list so that they cannot connect
     * to the server again.
     *
     * This also emits the `ban` event with the player object, the ban reason, and their id or ip as parameters.
     *
     * @param {string} [reason=''] The reason as to why this player's connection was closed and banned.
     */
    ban(reason = '') {
        this._socket.close(4000, reason);
        // this._socket.terminate(reason);
        this.emit('ban', this, reason);
    }
}
exports.default = Player;
