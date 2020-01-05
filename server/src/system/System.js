'use strict'

/**
 * The System handles system events and contains methods that apply to all players and rooms.
 */
module.exports = class System {
  /**
   * @param {Players} players A reference to the server's Players module.
   */
  constructor(players) {
    /**
     * A reference to the server's Players module.
     * 
     * @private
     * 
     * @property {Players}
     */
    this._players = players;
  }

  /**
   * Sends a message to all of the players connected to the server.
   * 
   * @param {string} type The type of message to send to all players.
   * @param {string} message The message to send to all of the players connected to the server.
   */
  broadcast(type, message) {
    this._players._players.map(player => player.message(type, message));
  }
};