import Hypergiant from 'hypergiant';
import GameGuardWebSocket from './interfaces/GameGuardWebSocket';
/**
 * Defines the properties and methods of a player, which is a client that has made
 * a successful connection to GameGuard.
 */
export default class Player {
    /**
     * The unique id of the player.
     *
     * @property {string}
     */
    id: string;
    /**
     * The client's most probably ip address.
     *
     * @property {string}
     */
    ip: string;
    /**
     * The client's WebSocket data.
     *
     * @property {GameGuardWebSocket}
     */
    ws: GameGuardWebSocket;
    /**
     * The signal that gets dispatched when the player receives a messsage from
     * the GameGuard client. This signal contains the Message object of the message
     * received.
     *
     * @property {Hypergiant}
     */
    messaged: Hypergiant;
    /**
     * The signal that gets dispatched when the player gets kicked from the GameGuard
     * server. This signal contains the player data object and the reason as to why the
     * player was kicked.
     *
     * @property {Hypergiant}
     */
    kicked: Hypergiant;
    /**
     * The signal that gets dispatched when the player gets banned from the GameGuard
     * server. This signal contains the player data object and the reason as to why the
     * player was banned.
     *
     * @property {Hypergiant}
     */
    banned: Hypergiant;
    /**
     * The signal that gets dispatched when the player attempts to connect to the
     * GameGuard server while banned and subsequently gets rejected.
     *
     * @property {Hypergiant}
     */
    rejected: Hypergiant;
    /**
     * The roundtrip latency of this player.
     *
     * @property {number}
     */
    latency: number;
    /**
     * Indicates whether this player is still connected to the GameGuard server or
     * not.
     *
     * @private
     *
     * @property {boolean}
     */
    private _isAlive;
    /**
     * The id of the heartbeat interval timer.
     *
     * @private
     *
     * @property {number}
     */
    private _heartbeatIntervalId;
    /**
     * The id of the latency interval timer.
     *
     * @private
     *
     * @property {number}
     */
    private _latencyIntervalId;
    /**
     * @param {string} id The unique id of the player.
     * @param {string} ip The most probably ip address of the player.
     * @param {GameGuardWebSocket} ws The client's WebSocket data.
     */
    constructor(id: string, ip: string, ws: GameGuardWebSocket);
    /**
     * Sends a message to this player's GameGuard client.
     *
     * @param {string} type The type of message that this message is.
     * @param {string} contents The contents of this message.
     */
    message(type: string, contents: string): void;
    /**
     * Kicks this player from the GameGuard server and dispatches the `kicked`
     * signal.
     *
     * @param {string} [reason='You have been kicked from the server'] A custom reason for kicking the player.
     */
    kick(reason?: string): void;
    /**
     * Kicks the player from the GameGuard server, dispatches the `banned` signal,
     * and then adds sets them as banned in the database.
     *
     * @param {string} [reason='You have been banned'] A custom reason for banning the player.
     */
    ban(reason?: string): void;
    /**
     * Kicks the player from the GameGuard server and dispatches the `rejected`
     * signal.
     *
     * @param {string} [reason='Your connection to the server has been rejected'] A custom reason for rejecting the player.
     */
    reject(reason?: string): void;
    /**
     * Called when this player receives a message.
     *
     * @private
     *
     * @param {Object} data The data of the message received.
     */
    private _onmessage;
    /**
     * Called when the player receives a 'latency-pong' message. We use this to
     * calculate the roundtrip latency and send the results back to the player.
     *
     * @param {number} previousTime The time calculated by the GameGuard client.
     */
    private _calculateLatency;
    /**
     * Called when the player receives a pong and sets `_isAlive` to true because
     * they have responded to the ping.
     *
     * @private
     */
    private _onpong;
    /**
     * Checks to see if the player has responded to the last ping check by the value
     * of the `_isAlive` variable and if not then they are kicked from the server. If
     * the player is still connected then we send another ping request.
     *
     * @private
     */
    private _ping;
    /**
     * Creates a hearbeat timer to check if the player is still connected to the
     * GameGuard server or not.
     *
     * @param {number} pingInterval The interval at which the GameGuard server checks to see if the player is still connected.
     */
    createHearbeatCheck(pingInterval: number): void;
    /**
     * Creates a latency timer to check the amount of time it takes for a packet
     * of data to get to the player's client and back.
     *
     * @param {number} latencyInterval The interval at which the GameGuard server checks the player's latency.
     */
    createLatencyCheck(latencyInterval: number): void;
}
