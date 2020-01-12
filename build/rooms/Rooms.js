'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const Room_1 = __importDefault(require("./Room"));
/**
 * The Rooms module handles managing rooms as a batch group.
 */
class Rooms extends events_1.default.EventEmitter {
    constructor() {
        super();
        /**
         * A reference to the rooms that have been created.
         *
         * @private
         *
         * @property {Array<Room>}
         */
        this._created = [];
    }
    /**
     * Returns the rooms that have been created.
     *
     * @returns {Array<Room>}
     */
    get created() { return this._created; }
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
    destroy(name) {
        this._created = this.created.filter((room) => room.name !== name);
        this.emit('room-destroyed', name);
    }
}
exports.default = Rooms;
