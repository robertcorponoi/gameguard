'use strict'

import Hypergiant from 'hypergiant';

import Message from '../message/Message';
import SocketCloseInfo from '../options/SocketCloseInfo';

import { bufferToMessage } from '../utils/utils';

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
  private _id: string;

  /**
   * A reference to the WebSocket connection object for this player.
   * 
   * @private
   * 
   * @property {*}
   */
  private _socket: any;

  /**
   * A reference to the http request object for this player.
   * 
   * @private
   * 
   * @property {*}
   */
  private _request: any;

  /**
   * The most probably ip address for this player.
   * 
   * @private
   * 
   * @property {string}
   */
  private _ip: string;

  /**
   * The signal that is dispatched when this player is kicked.
   *
   * @private
   *
   * @property {Hypergiant}
   */
  private _kicked: Hypergiant = new Hypergiant();

  /**
   * The signal that is dispatched when this player is banned.
   *
   * @private
   *
   * @property {Hypergiant}
   */
  private _banned: Hypergiant = new Hypergiant();

  /**
   * Indicates whether this player's connection is still alive or not.
   * 
   * @private
   * 
   * @property {boolean}
   * 
   * @default true
   */
  private _isAlive: boolean = true;

  /**
   * This players latency.
   * 
   * @property {number}
   */
  public latency: number = 0;

  /**
   * The value returned from the ping setInterval call.
   * 
   * @private
   * 
   * @property {*}
   */
  private _pingIntervalId: any;

  /**
   * The value returned from the latency setInterval call.
   * 
   * @private
   * 
   * @property {*}
   */
  private _latencyIntervalId: any;

  /**
   * @param {string} id The id assigned to this player by the client.
   * @param {*} socket A reference to the WebSocket connection object for this player.
   * @param {*} request A reference to the http request object for this player.
   */
  constructor(id: string, socket: any, request: any) {
    this._id = id;

    this._socket = socket;

    this._request = request;

    this._ip = this._request.headers['x-forwarded-for'] || this._request.connection.remoteAddress;

    this._socket.on('message', (message: string) => this._onmessage(message));

    this._socket.on('pong', () => this._isAlive = true);
  }

  /**
   * Returns this player's websocket connection.
   * 
   * @returns {*}
   */
  get socket(): any { return this._socket; }

  /**
   * Returns the id of this player.
   * 
   * @returns {string}
   */
  get id(): string { return this._id; }

  /**
   * Returns the ip address of this player.
   * 
   * @returns {string}
   */
  get ip(): string { return this._ip; }

  /**
   * Returns the onKick signal.
   *
   * @returns {Hypergiant}
   */
  get kicked(): Hypergiant { return this._kicked; }

  /**
   * Returns the onBan signal.
   *
   * @returns {Hypergiant}
   */
  get banned(): Hypergiant { return this._banned; }

  /**
   * Sets the value from the ping setInterval call.
   * 
   * @param {*} id The new id of the setInterval call.
   */
  set pingIntervalId(id: any) { this._pingIntervalId = id; }

  /**
   * Sets the value from the latency setInterval call.
   * 
   * @param {*} interval The new id of the setInterval call.
   */
  set latencyIntervalId(id: any) { this._latencyIntervalId = id; }

  /**
   * Sends a message to this Player.
   * 
   * @param {string} type The type of message to send.
   * @param {string} contents The contents of the message to send. The contents can be an object but it must be stringified.
   */
  message(type: string, contents: string) {
    const message: Message = new Message(type, contents);

    this._socket.send(message.binary);
  }

  /**
   * Closes this player's connection to the server.
   * 
   * This also emits the `kick` event with the player object and the reason as parameters.
   * 
   * @param {string} [reason=''] The reason as to why this player's connection was closed. This will override any reason set for `kicked` in the initialization options.
   */
  kick(reason: string = '') {
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
  ban(reason: string = '') {
    this.banned.dispatch(this, reason);
  }

  /**
   * Pings the player and terminates their connection if they're not responding.
   */
  ping() {
    if (!this._isAlive) return this.kick('Not responding');

    this._isAlive = false;
    
    this._socket.ping(() => {});
  }

  /**
   * When this client is messaged, check out the type of message and respond accordingly.
   * 
   * @private
   * 
   * @param {string} message The message sent from the client.
   */
  private _onmessage(message: string) {
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
