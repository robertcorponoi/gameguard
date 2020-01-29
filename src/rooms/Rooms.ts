'use strict'

import Hypergiant from 'hypergiant';

import Room from './Room';

/**
 * The Rooms module handles managing rooms as a batch group.
 */
export default class Rooms {
  /**
   * A reference to the rooms that have been created.
   * 
   * @private
   * 
   * @property {Array<Room>}
   */
  private _rooms: Array<Room> = [];

  /**
   * The signal that is dispatched when a room is created.
   *
   * The data contained in the signal is: the room object.
   *
   * @private
   *
   * @property {Hypergiant}
   */
  private _created: Hypergiant = new Hypergiant();
  
  /**
   * The signal that is dispatched when a room is destroyed.
   *
   * The data contained in the signal is: the name of the room that was destroyed.
   *
   * @private
   *
   * @property {Hypergiant}
   */
  private _destroyed: Hypergiant = new Hypergiant();

  /**
   * Returns all of the rooms that have been created.
   *
   * @returns {Array<Room>}
   */
  get rooms(): Array<Room> { return this._rooms; }

  /**
   * Returns the created signal.
   * 
   * @returns {Array<Room>}
   */
  get created(): Hypergiant { return this._created; }

  /**
   * Returns the room destroyed signal.
   *
   * @returns {Hypergiant}
   */
  get destroyed(): Hypergiant { return this._destroyed; }

  /**
   * Creates a new room and adds it to the list of rooms that have been created.
   * 
   * This also emits the `room-created` event that contains the room object as a parameter.
   * 
   * @param {string} name The name of the room to create.
   * @param {number} [capacity=Infinity] The maximum number of players that can be in this room.
   * 
   * @returns {Room} Returns the created room.
   */
  create(name: string, capacity: number = Infinity): Room {
    this.rooms.map((room: Room) => {
      if (room.name === name) throw new Error('A room already exists with the name provided');
    });

    const room: Room = new Room(name, capacity);

    this._rooms.push(room);

    this.created.dispatch(room);

    return room;
  }

  /**
   * Destroys a room.
   * 
   * This also emits the `room-destroyed` event that contains the name of the room that was destroyed.
   * 
   * @param {string} name The name of the room to destroy.
   */
  destroy(name: string) {
    this._rooms = this.rooms.filter((room: Room) => room.name !== name);

    this.destroyed.dispatch(name);
  }

  /**
   * Removes all listeners attached to any signals.
   */
  removeAllListeners() {
    this.created.removeAll();
    this.destroyed.removeAll();
  }
}
