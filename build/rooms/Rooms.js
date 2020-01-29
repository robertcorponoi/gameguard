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
        this._created = [];
        /**
         * The signal that is dispatched when a room is created.
         *
         * The data contained in the signal is: the room object.
         *
         * @private
         *
         * @property {Hypergiant}
         */
        this._roomCreated = new hypergiant_1.default();
        /**
         * The signal that is dispatched when a room is destroyed.
         *
         * The data contained in the signal is: the name of the room that was destroyed.
         *
         * @private
         *
         * @property {Hypergiant}
         */
        this._roomDestroyed = new hypergiant_1.default();
    }
    /**
     * Returns the rooms that have been created.
     *
     * @returns {Array<Room>}
     */
    get created() { return this._created; }
    /**
     * Returns the room created signal.
     *
     * @returns {Hypergiant}
     */
    get roomCreated() { return this._roomCreated; }
    /**
     * Returns the room destroyed signal.
     *
     * @returns {Hypergiant}
     */
    get roomDestroyed() { return this._roomDestroyed; }
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
        this.created.map((room) => {
            if (room.name === name)
                throw new Error('A room already exists with the name provided');
        });
        const room = new Room_1.default(name, capacity);
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
    destroy(name) {
        this._created = this.created.filter((room) => room.name !== name);
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
exports.default = Rooms;
