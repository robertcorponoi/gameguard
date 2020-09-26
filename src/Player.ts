'use strict'

import ws from 'ws';
import Hypergiant from 'hypergiant';

import Message from './Message';
import { messageToBuffer, bufferToMessage } from './utils';
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
    messaged = new Hypergiant();

    /**
     * The signal that gets dispatched when the player gets kicked from the GameGuard
     * server. This signal contains the player data object and the reason as to why the 
     * player was kicked.
     * 
     * @property {Hypergiant}
     */
    kicked = new Hypergiant();

    /**
     * The signal that gets dispatched when the player gets banned from the GameGuard
     * server. This signal contains the player data object and the reason as to why the 
     * player was banned.
     * 
     * @property {Hypergiant}
     */
    banned = new Hypergiant();

    /**
     * The signal that gets dispatched when the player attempts to connect to the
     * GameGuard server while banned and subsequently gets rejected.
     * 
     * @property {Hypergiant}
     */
    rejected = new Hypergiant();

    /**
     * The roundtrip latency of this player.
     * 
     * @property {number}
     */
    latency = 0;

    /**
     * Indicates whether this player is still connected to the GameGuard server or
     * not.
     * 
     * @private
     * 
     * @property {boolean}
     */
    private _isAlive = true;

    /**
     * The id of the heartbeat interval timer.
     * 
     * @private
     * 
     * @property {number}
     */
    private _heartbeatIntervalId!: ReturnType<typeof setTimeout>;

    /**
     * The id of the latency interval timer.
     * 
     * @private
     * 
     * @property {number}
     */
    private _latencyIntervalId!: ReturnType<typeof setTimeout>;

    /**
     * @param {string} id The unique id of the player.
     * @param {string} ip The most probably ip address of the player.
     * @param {GameGuardWebSocket} ws The client's WebSocket data.
     */
    constructor(id: string, ip: string, ws: GameGuardWebSocket) {
        this.id = id;
        this.ip = ip;
        this.ws = ws;

        // When the player receives a message we have call `_onMessage` to convert it
        // from binary to a string and then dispatch the signal for it.
        this.ws.on('message', (event: ArrayBuffer) => this._onmessage(event));

        // When the player's socket receives a pong, we respond with `_onPong` to let the
        // GameGuard server know this player is still connected.
        this.ws.on('pong', () => this._onpong());
    }

    /**
     * Sends a message to this player's GameGuard client.
     * 
     * @param {string} type The type of message that this message is.
     * @param {string} contents The contents of this message.
     */
    message(type: string, contents: string) {
        const message = new Message(type, contents);
        this.ws.send(messageToBuffer(message));
    }

    /**
     * Kicks this player from the GameGuard server and dispatches the `kicked`
     * signal.
     * 
     * @param {string} [reason='You have been kicked from the server'] A custom reason for kicking the player.
     */
    kick(reason: string = 'You have been kicked from the GameGuard server') {
        this.ws.close(4002, reason);
        this.kicked.dispatch(this, reason);
    }

    /**
     * Kicks the player from the GameGuard server, dispatches the `banned` signal,
     * and then adds sets them as banned in the database.
     * 
     * @param {string} [reason='You have been banned'] A custom reason for banning the player.
     */
    ban(reason: string = 'You have been banned from the GameGuard server') {
        this.ws.close(4003, reason);
        this.banned.dispatch(this, reason);
    }

    /**
     * Kicks the player from the GameGuard server and dispatches the `rejected`
     * signal.
     * 
     * @param {string} [reason='Your connection to the server has been rejected'] A custom reason for rejecting the player.
     */
    reject(reason: string = 'Your connection to the server has been rejected') {
        this.ws.close(4004, reason);
        this.rejected.dispatch(this, reason);
    }

    /**
     * Called when this player receives a message.
     * 
     * @private
     * 
     * @param {Object} data The data of the message received.
     */
    private _onmessage(event: ArrayBuffer) {
        // First we have to get the Message representation of the message received.
        const message = bufferToMessage(event);

        // The GameGuard client has responded to our latency-ping request so we now have enough information
        // to calcualte the roundtrip latency of the player.
        if (message.type === 'latency-pong') this._calculateLatency(parseInt(message.contents));
        // Otherwise the message isn't for us so we just dispatch the `messageReceived` signal.
        else this.messaged.dispatch(message);
    }

    /**
     * Called when the player receives a 'latency-pong' message. We use this to
     * calculate the roundtrip latency and send the results back to the player.
     * 
     * @param {number} previousTime The time calculated by the GameGuard client.
     */
    private _calculateLatency(previousTime: number) {
        // The GameGuard client has responded to our latency-ping request so we now have enough information
        // to calcualte the roundtrip latency of the player.
        const currentTime = Date.now();
        this.latency = (currentTime - previousTime) / 2;

        // Now we send a message to the GameGuard client to let the user know their most up to date latency.
        this.message('latency', this.latency.toString());
    }

    /**
     * Called when the player receives a pong and sets `_isAlive` to true because
     * they have responded to the ping.
     * 
     * @private
     */
    private _onpong() {
        this._isAlive = true;
    }

    /**
     * Checks to see if the player has responded to the last ping check by the value
     * of the `_isAlive` variable and if not then they are kicked from the server. If
     * the player is still connected then we send another ping request.
     * 
     * @private
     */
    private _ping() {
        if (!this._isAlive) {
            this.kick('Player not responding to heartbeat checks');
            return;
        }

        this._isAlive = false;
        this.ws.ping(() => { });
    }

    /**
     * Creates a hearbeat timer to check if the player is still connected to the
     * GameGuard server or not.
     * 
     * @param {number} pingInterval The interval at which the GameGuard server checks to see if the player is still connected.
     */
    createHearbeatCheck(pingInterval: number) {
        this._heartbeatIntervalId = setInterval(() => { this._ping(); }, pingInterval);
    }

    /**
     * Creates a latency timer to check the amount of time it takes for a packet
     * of data to get to the player's client and back.
     * 
     * @param {number} latencyInterval The interval at which the GameGuard server checks the player's latency.
     */
    createLatencyCheck(latencyInterval: number) {
        this._latencyIntervalId = setInterval(() => {
            this.message('latency-ping', `${Date.now()}`);
        }, latencyInterval);
    }
}