'use strict'

import Message from './message/Message.js';
import Options from './options/Options.js';
import ClientData from './data/ClientData.js';
import Eventverse from '../node_modules/eventverse/eventverse.js';

/**
 * The GameGuard client is used to establish a connection to the server send player info.
 */
export default class GameGuardClient extends Eventverse {
  /**
   * @param {Object} [options] The initialization parameters passed to this instance.
   * @param {boolean} [options.secure=false] Indicates whether the websocket will connect to the server with a secure connection or not.
   */
  constructor(options = {}) {
    super();

    /**
     * A reference to this client's options.
     * 
     * @private
     * 
     * @property {Options}
     */
    this._options = new Options(options);

    /**
     * A reference to this client's WebSocket connection.
     * 
     * @private
     * 
     * @property {WebSocket}
     */
    this._socket = null;

    /**
     * A reference to the ClientData module.
     * 
     * @private
     * 
     * @property {ClientData}
     */
    this._clientData = new ClientData();

    this._boot();
  }

  /**
   * Initialize the WebSocket connection and all of the events that we need to respond to.
   * 
   * @private
   */
  _boot() {
    const wsProtocol = this._options.secure ? 'wss' : 'ws';

    this._socket = new WebSocket(`${wsProtocol}://${window.location.host}/`);

    this._socket.addEventListener('open', () => this._onOpen());

    this._socket.addEventListener('message', (message) => this._onMessage(message));

    this._socket.addEventListener('close', (ev) => this._onClose(ev));
  }

  /**
   * When the WebSocket connection opens, we check to see if they are an existing GameGuard player using cookies
   * and if they are not then they are assigned a new GameGuard player id.
   * 
   * @private
   */
  _onOpen() {
    const playerId = this._clientData.getPlayerId();

    const message = new Message('player-joined', playerId);

    this._socket.send(message.stringify());

    this.emit('open', playerId);
  }

  /**
   * TODO:
   * 
   * @param {string} message The message Object received from the server.
   */
  _onMessage(message) {
    const parsed = JSON.parse(message.data);

    const msg = new Message(parsed.type, parsed.content);

    this.emit('message', msg);
  }

  /**
   * When the WebSocket connection closes, we end the players connection to the game and notify them why, if a reason
   * was provided.
   * 
   * @property {Event} ev The WebSocket close event Object.
   */
  _onClose(ev) {
    this.emit('close', ev);
  }
}