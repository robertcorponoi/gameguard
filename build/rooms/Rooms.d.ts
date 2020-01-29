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
    private _created;
    /**
     * The signal that is dispatched when a room is created.
     *
     * The data contained in the signal is: the room object.
     *
     * @private
     *
     * @property {Hypergiant}
     */
    private _roomCreated;
    /**
     * The signal that is dispatched when a room is destroyed.
     *
     * The data contained in the signal is: the name of the room that was destroyed.
     *
     * @private
     *
     * @property {Hypergiant}
     */
    private _roomDestroyed;
    /**
     * Returns the rooms that have been created.
     *
     * @returns {Array<Room>}
     */
    get created(): Array<Room>;
    /**
     * Returns the room created signal.
     *
     * @returns {Hypergiant}
     */
    get roomCreated(): Hypergiant;
    /**
     * Returns the room destroyed signal.
     *
     * @returns {Hypergiant}
     */
    get roomDestroyed(): Hypergiant;
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
    /**
     * Removes all listeners attached to any signals.
     */
    removeAllListeners(): void;
}
