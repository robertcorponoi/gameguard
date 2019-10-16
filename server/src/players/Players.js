'use strict'

const Player = require('./Player');
const EventEmitter = require('events').EventEmitter;

/**
 * The Players module handles creating new players, managing their state within the game, and removing them.
 */
module.exports = class Players extends EventEmitter {

  /**
   * @param {Storage} storage A reference to the Storage module to keep track of player states.
   */
  constructor(storage) {

    super();

    /**
     * A reference to the Storage module to keep track of player states.
     * 
     * @private
     * 
     * @property {Storage}
     */
    this._storage = storage;

    /**
     * A reference to all of the players that are currently connected to the game server.
     * 
     * @private
     * 
     * @property {Array<Player>}
     */
    this._players = [];

  }

  /**
   * Adds a player to the Array of players connected to the game.
   * 
   * This also emits a 'player-joined' event that can be listened to and it contains the Object of the player that
   * joined the game server.
   * 
   * @private
   * 
   * @param {string} id The id of the player to add to the game server.
   * @param {Object} ws The WebSocket connection Object of the player to add.
   * @param {Object} req The http request connection Object of the player to add.
   */
  _add(id, ws, req) {

    const player = new Player(id, ws, req);

    player.on('kick', (player, reason) => this._onkick(player, reason));

    player.on('ban', (reason, info) => this._onban(reason, info));

    this._players.push(player);

    this.emit('player-joined', player);

  }

  /**
   * Removes a player from the Array of players connected to the game.
   * 
   * This also emits a 'player-left' event that can be listened to and it contains the Object of the player that
   * was removed from the game server.
   * 
   * @private
   * 
   * @param {Player} player The player to remove from the game server.
   */
  _remove(player) {

    this._players = this._players.filter(pl => pl.id !== player.id);

    this.emit('player-left', player);

  }

  /**
   * When a player is kicked, we remove them from the Array of players connected to the game.
   * 
   * This also emites a 'player-kicked' event that can be listened to which contains the Object of the player that was removed from the game server and the
   * reason as to why the player was removed.
   * 
   * @private
   * 
   * @param {Player} player The player that was kicked from the game server.
   * @param {string} reason The reason as to why the player was kicked from the game.
   */
  _onkick(player, reason) {

    this._remove(player);

    this.emit('player-kicked', player, reason);

  }

  /**
   * When a player is banned, we remove them from the Array of players connected to the game and then also add them to the Storage so that
   * they can't connect back to the game.
   * 
   * This also emits a 'player-banned' event that can be listened to which contains the Object of the player that was banned and the reason
   * that they were banned.
   * 
   * @private
   * 
   * @param {Player} player The player that was banned from the game server.
   * @param {Object} info
   * @param {string} info.reason The reason as to why the player was banned from the game.
   * @param {string} info.id The IP or id of the player to add to the list of players banned from the game.
   */
  _onban(player, info) {

    this._storage._ban(info.id);

    this._remove(player);

    this.emit('player-banned', player, info.reason);

  }

};