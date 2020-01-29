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
  private _created: Array<Room> = [];

  /**
   * The signal that is dispatched when a room is created.
   *
   * The data contained in the signal is: the room object.
   *
   * @private
   *
   * @property {Hypergiant}
   */
  private _roomCreated: Hypergiant = new Hypergiant();
  
  /**
   * The signal that is dispatched when a room is destroyed.
   *
   * The data contained in the signal is: the name of the room that was destroyed.
   *
   * @private
   *
   * @property {Hypergiant}
   */
  private _roomDestroyed: Hypergiant = new Hypergiant();

  /**
   * Returns the rooms that have been created.
   * 
   * @returns {Array<Room>}
   */
  get created(): Array<Room> { return this._created; }

  /**
   * Returns the room created signal.
   *
   * @returns {Hypergiant}
   */
  get roomCreated(): Hypergiant { return this._roomCreated; }
  
  /**
   * Returns the room destroyed signal.
   *
   * @returns {Hypergiant}
   */
  get roomDestroyed(): Hypergiant { return this._roomDestroyed; }

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
    this.created.map((room: Room) => {
      if (room.name === name) throw new Error('A room already exists with the name provided');
    });

    const room: Room = new Room(name, capacity);

    this._created.push(room);

    this.roomCreated.dispatch(room);

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
    this._created = this.created.filter((room: Room) => room.name !== name);

    this.roomDestroyed.dispatch(name);
  }

  /**
   * Removes all listeners attached to any signals.
   */
  removeAllListeners() {
    this.roomCreated.removeAll();
    this.roomDestroyed.removeAll();
  }
}
