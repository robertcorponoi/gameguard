'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A room is used to describe a group of players that can have actions performed on them together.
 */
class Room {
    /**
     * @param {string} name The name of this room.
     * @param {number} capacity The maximum number of players that can be in this room.
     */
    constructor(name, capacity) {
        /**
         * The number of players currently in this room.
         *
         * @private
         *
         * @property {number}
         */
        this._playerCount = 0;
        /**
         * A reference to the players currently in this room.
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
     * Returns the name of this room.
     *
     * @returns {string}
     */
    get name() { return this._name; }
    /**
     * Returns the number of players currently in this room.
     *
     * @returns {number}
     */
    get playerCount() { return this._playerCount; }
    /**
     * Returns the list of players currently in this room.
     *
     * @returns {Array<Player>}
     */
    get players() { return this._players; }
    /**
     * Returns the maximum number of players that can be in this room.
     *
     * @returns {number}
     */
    get capacity() { return this._capacity; }
    /**
     * Sets a new value for the maximum number of a players that can be in this room.
     *
     * If the new capacity is lower than the current number of players in the room, an error will be thrown.
     *
     * @param {number} capacity The new capacity for this room.
     */
    set capacity(capacity) {
        if (capacity < this.playerCount)
            throw new Error('The new capacity is lower than the current amount of players in this room');
        this._capacity = capacity;
    }
    /**
     * Adds a player to this room.
     *
     * If the room is at capacity, nothing will happen.
     *
     * @param {Player} player A reference to the player to add to this room.
     */
    add(player) {
        if (this.playerCount === this.capacity)
            return;
        this._players.push(player);
        this._playerCount++;
    }
    /**
     * Removes a player from this room.
     *
     * @param {Player} player A reference to the player to remove from this room.
     */
    remove(player) {
        this._players = this._players.filter((p) => p !== player);
        this._playerCount--;
    }
    /**
     * Removes all players from this room.
     */
    clear() {
        this._players = [];
        this._playerCount = 0;
    }
    /**
     * Sends a message to every player in this room.
     *
     * @param {string} type The type of message to send.
     * @param {string} contents The contents of the message to send. The contents can be an object but it must be stringified.
     */
    broadcast(type, contents) {
        this.players.map((player) => player.message(type, contents));
    }
}
exports.default = Room;
