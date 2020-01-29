'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hypergiant_1 = __importDefault(require("hypergiant"));
const Room_1 = __importDefault(require("./Room"));
/**
 * The Rooms module handles managing rooms as a batch group.
 */
class Rooms {
    constructor() {
        /**
         * A reference to the rooms that have been created.
         *
         * @private
         *
         * @property {Array<Room>}
         */
        this._rooms = [];
        /**
         * The signal that is dispatched when a room is created.
         *
         * The data contained in the signal is: the room object.
         *
         * @private
         *
         * @property {Hypergiant}
         */
        this._created = new hypergiant_1.default();
        /**
         * The signal that is dispatched when a room is destroyed.
         *
         * The data contained in the signal is: the name of the room that was destroyed.
         *
         * @private
         *
         * @property {Hypergiant}
         */
        this._destroyed = new hypergiant_1.default();
    }
    /**
     * Returns all of the rooms that have been created.
     *
     * @returns {Array<Room>}
     */
    get rooms() { return this._rooms; }
    /**
     * Returns the created signal.
     *
     * @returns {Array<Room>}
     */
    get created() { return this._created; }
    /**
     * Returns the room destroyed signal.
     *
     * @returns {Hypergiant}
     */
    get destroyed() { return this._destroyed; }
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
    create(name, capacity = Infinity) {
        this.rooms.map((room) => {
            if (room.name === name)
                throw new Error('A room already exists with the name provided');
        });
        const room = new Room_1.default(name, capacity);
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
    destroy(name) {
        this._rooms = this.rooms.filter((room) => room.name !== name);
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
exports.default = Rooms;
