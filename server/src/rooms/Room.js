'use strict'

/**
 * The Room module represents a collection of players.
 */
module.exports = class Room {

  /**
   * @param {string} name The name of this room.
   * @param {number} capacity The maximum number of players that can be in this room.
   */
  constructor(name, capacity) {

    /**
     * The name of this room.
     * 
     * @private
     * 
     * @property {string}
     */
    this._name = name;

    /**
     * The maximum number of players that can be in this room.
     * 
     * @private
     * 
     * @property {number}
     */
    this._capacity = capacity;

    /**
     * The number of players currently in this room.
     * 
     * @private
     * 
     * @property {number}
     */
    this._playerCount = 0;

    /**
     * A reference to the players currently in this room.
     * 
     * @private
     * 
     * @property {Array<Player>}
     */
    this._players = [];

  }

  /**
   * Returns the name of this room.
   * 
   * @returns {string}
   */
  get name() {

    return this._name;

  }

  /**
   * Returns the number of players currently in this room.
   * 
   * @returns {number}
   */
  get playerCount() {

    return this._playerCount;

  }

  /**
   * Returns the players currently in this room.
   * 
   * @returns {Array<Player>}
   */
  get players() {

    return this._players;

  }

  /**
   * Returns the maximum number of players that can be in this room.
   * 
   * @returns {number}
   */
  get capacity() {

    return this._capacity;

  }

  /**
   * Sets a new capacity for this room.
   * 
   * If the new capacity is lower than the current number of players in the room, an error will be thrown
   * so it's recommended to wrap this in a try catch.
   * 
   * @param {number} newCapacity The new maximum number of players that can be in this room.
   */
  set capacity(newCapacity) {

    if (newCapacity < this.playerCount) throw new Error('The new capacity is lower than the current amount of players in this room');

    this._capacity = newCapacity;

  }

  /**
   * Adds a player to this room.
   * 
   * If the room is at capacity, an error will be thrown so it's recommended to wrap this in a try catch.
   * 
   * @param {Player} player The player to add to this room.
   */
  add(player) {

    if (this.playerCount === this.capacity) throw new Error(`Room ${this.name} is at capacity`);

    this._players.push(player);

    this._playerCount++;

  }

  /**
   * Removes a player from this room.
   * 
   * @param {Player} player The player to remove from this room.
   */
  remove(player) {

    this._players = this._players.filter(p => p !== player);

    this._playerCount--;

  }

  /**
   * Removes all players from this room.
   */
  clear() {

    this._players = [];

  }

  /**
   * Sends a message to every player in this room.
   * 
   * @param {string} type The type of message to send.
   * @param {string} message The message to send to every player in this room.
   */
  broadcast(type, message) {

    this._players.map(player => {
      player.message(type, message);
    });

  }

};