/// <reference types="node" />
import events from 'events';
/**
 * A Player represents a client that has established a successful connection to GameGuard.
 *
 * The player is created after the client has established an id for them.
 */
export default class Player extends events.EventEmitter {
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
     * @param {string} id The id assigned to this player by the client.
     * @param {*} socket A reference to the WebSocket connection object for this player.
     * @param {*} request A reference to the http request object for this player.
     */
    constructor(id: string, socket: any, request: any);
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
     * @param {string} [reason=''] The reason as to why this player's connection was closed.
     */
    kick(reason?: string): void;
    /**
     * Closes this player's connection to the server and adds them on a banned player list so that they cannot connect
     * to the server again.
     *
     * This also emits the `ban` event with the player object, the ban reason, and their id or ip as parameters.
     *
     * @param {string} [reason=''] The reason as to why this player's connection was closed and banned.
     */
    ban(reason?: string): void;
}
