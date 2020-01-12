'use strict'

import events from 'events';

import Room from './Room';

/**
 * The Rooms module handles managing rooms as a batch group.
 */
export default class Rooms extends events.EventEmitter {
  /**
   * A reference to the rooms that have been created.
   * 
   * @private
   * 
   * @property {Array<Room>}
   */
  private _created: Array<Room> = [];

  constructor() { super(); }

  /**
   * Returns the rooms that have been created.
   * 
   * @returns {Array<Room>}
   */
  get created(): Array<Room> { return this._created; }

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

    this.emit('room-created', room);

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

    this.emit('room-destroyed', name);
  }
}