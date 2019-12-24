'use strict'

const Room = require('./Room');
const EventEmitter = require('events').EventEmitter;

/**
 * Rooms is used to create, manage, and remove rooms.
 */
module.exports = class Rooms extends EventEmitter {

  constructor() {

    super();

    /**
     * All of the rooms that have been created.
     * 
     * @private
     * 
     * @property {Array<Room>}
     */
    this._rooms = [];

  }

  /**
   * Returns all rooms that have been created.
   * 
   * @returns {Array<Room>}
   */
  get rooms() { return this._rooms; }

  /**
   * Creates a new room.
   * 
   * @param {string} name The name of the room to create.
   * @param {number} [capacity=Infinity] The maximum number of players that can be in this room.
   */
  create(name, capacity = Infinity) {

    for (const room of this.rooms) if (room.name === name) throw new Error('A room already exists with the name provided');

    const room = new Room(name, capacity);

    this._rooms.push(room);

    this.emit('room-created', room);

    return room;

  }

  /**
   * Destroys a room.
   * 
   * @param {string} name The name of the room to destroy.
   */
  destroy(name) {

    this._rooms = this._rooms.filter(room => room.name !== name);

    this.emit('room-destroyed', name);

  }

}