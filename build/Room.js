'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A room is a collection of players that can receive actions together.
 */
class Room {
    /**
     * @param {string} name The name of the room.
     * @param {number} capacity The maximum number of players that can be in this room.
     */
    constructor(name, capacity) {
        /**
         * The players that are in the room.
         *
         * @private
         *
         * @property {Array<Player>}
         */
        this._players = [];
        this._name = name;
        this._capacity = capacity;
    }
    /**
     * Returns the name of the room.
     *
     * @returns {string}
     */
    get name() { return this._name; }
    /**
     * Returns the capcity of the room.
     *
     * @returns {number}
     */
    get capacity() { return this._capacity; }
    /**
     * Returns the players in the room.
     *
     * @returns {Array<Player>}
     */
    get players() { return this._players; }
    /**
     * Returns the current number of players in the room.
     *
     * @returns {number}
     */
    get playerCount() { return this._players.length; }
    /**
     * Sets a new capacity for the room. If the new capacity is lower than the
     * current number of players in the room, the capcity will not be changed.
     *
     * @param {number} newCapacity The new capacity for the room.
     */
    set capacity(newCapacity) {
        if (newCapacity < this.playerCount) {
            console.warn('The new capacity is lower than the current amount of players in this room, skipping...');
            return;
        }
        this._capacity = newCapacity;
    }
    /**
     * Adds a player to the room if the room is not at full capacity. If it is at full
     * capacity then a warning will be logged and the player will not be added.
     *
     * @param {Player} player The player to add to the room.
     */
    addPlayer(player) {
        if (this.playerCount === this.capacity) {
            console.warn('The room is at capacity, skipping');
            return;
        }
        this._players.push(player);
    }
    /**
     * Removes a player from room room.
     *
     * @param {Player} player The player to remove from the room.
     */
    removePlayer(player) {
        this._players = this._players.filter((p) => p.id !== player.id);
    }
    /**
     * Removes all players from the room.
     */
    clear() {
        this._players = [];
    }
    /**
     * Sends a message to every player in the room.
     *
     * @param {string} type The type of message to send.
     * @param {contents} contents The contents of the message to send.
     */
    broadcast(type, contents) {
        this.players.forEach((p) => p.message(type, contents));
    }
}
exports.default = Room;
