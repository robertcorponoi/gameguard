'use strict'

const Message = require('../message/Message');
const EventEmitter = require('events').EventEmitter;

/**
 * A Player represents a GameGuard client that has made a successful connection to the GameGuard server.
 */
module.exports = class Player extends EventEmitter {

  /**
   * @param {string} id The id assigned to this player by the client GameGuard instance.
   * @param {Object} ws The WebSocket connection Object for this player.
   * @param {Object} req The http request connection Object for this player.
   */
  constructor(id, ws, req) {

    super();

    /**
     * The id assigned to this player by the client GameGuard instance.
     * 
     * @private
     * 
     * @property {string}
     */
    this._id = id;

    /**
     * A reference to the WebSocket connection Object for this player.
     * 
     * @private
     * 
     * @property {Object}
     */
    this._ws = ws;

    /**
     * A reference to the http request connection Object for this player.
     * 
     * @private
     * 
     * @property {Object}
     */
    this._req = req;

    /**
     * The most probable IP address of this player based on the presence of a 'x-forwarded-for' header
     * property.
     * 
     * @private
     * 
     * @property {string}
     */
    this._ip = this._req.headers['x-forwarded-for'] || this._req.connection.remoteAddress;

  }

  /**
   * Returns the id for this player.
   * 
   * @returns {string}
   */
  get id() { return this._id; }

  /**
   * Returns the IP address of this player.
   * 
   * @returns {string}
   */
  get ip() { return this._ip; }

  /**
   * Sends a message to this Player.
   * 
   * @param {string} type The type of message being sent.
   * @param {string} message The message to send to this Player.
   */
  message(type, message) {

    const msg = new Message(type, message);

    const normalized = JSON.stringify(msg);

    this._ws.send(normalized);

  }

  /**
   * Kicks the player from the game and ends their connection to the game server.
   * 
   * @param {string} reason The reason as to why the Player was kicked from the game server.
   */
  kick(reason) {

    this._ws.terminate(reason);

    this.emit('kick', this, reason);

  }

  /**
   * Kicks the player from the game and ends their connection to the game server. This also puts them on a list of banned
   * players from the game so they can't rejoin.
   * 
   * @param {string} reason The reason as to why the Player was banned from the game server.
   * @param {boolean} [useIP=false] Indicates whether the Player's IP should be banned instead of just their individual id.
   */
  ban(reason, useIP = false) {

    this._ws.terminate(reason);

    const info = useIP ? this.ip : this.id;

    this.emit('ban', this, { reason: reason, id: info });

  }

}