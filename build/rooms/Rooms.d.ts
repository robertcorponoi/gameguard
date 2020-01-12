/// <reference types="node" />
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
    private _created;
    constructor();
    /**
     * Returns the rooms that have been created.
     *
     * @returns {Array<Room>}
     */
    get created(): Array<Room>;
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
    create(name: string, capacity?: number): Room;
    /**
     * Destroys a room.
     *
     * This also emits the `room-destroyed` event that contains the name of the room that was destroyed.
     *
     * @param {string} name The name of the room to destroy.
     */
    destroy(name: string): void;
}
