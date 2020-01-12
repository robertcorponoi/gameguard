import Player from '../players/Player';
/**
 * A room is used to describe a group of players that can have actions performed on them together.
 */
export default class Room {
    /**
     * The name of this room.
     *
     * @private
     *
     * @property {string}
     */
    private _name;
    /**
     * The maximum number of players that can be in this room.
     *
     * @private
     *
     * @property {number}
     */
    private _capacity;
    /**
     * The number of players currently in this room.
     *
     * @private
     *
     * @property {number}
     */
    private _playerCount;
    /**
     * A reference to the players currently in this room.
     *
     * @private
     *
     * @property {Array<Player>}
     */
    private _players;
    /**
     * @param {string} name The name of this room.
     * @param {number} capacity The maximum number of players that can be in this room.
     */
    constructor(name: string, capacity: number);
    /**
     * Returns the name of this room.
     *
     * @returns {string}
     */
    get name(): string;
    /**
     * Returns the number of players currently in this room.
     *
     * @returns {number}
     */
    get playerCount(): number;
    /**
     * Returns the list of players currently in this room.
     *
     * @returns {Array<Player>}
     */
    get players(): Array<Player>;
    /**
     * Returns the maximum number of players that can be in this room.
     *
     * @returns {number}
     */
    get capacity(): number;
    /**
     * Sets a new value for the maximum number of a players that can be in this room.
     *
     * If the new capacity is lower than the current number of players in the room, an error will be thrown.
     *
     * @param {number} capacity The new capacity for this room.
     */
    set capacity(capacity: number);
    /**
     * Adds a player to this room.
     *
     * If the room is at capacity, nothing will happen.
     *
     * @param {Player} player A reference to the player to add to this room.
     */
    add(player: Player): void;
    /**
     * Removes a player from this room.
     *
     * @param {Player} player A reference to the player to remove from this room.
     */
    remove(player: Player): void;
    /**
     * Removes all players from this room.
     */
    clear(): void;
    /**
     * Sends a message to every player in this room.
     *
     * @param {string} type The type of message to send.
     * @param {string} contents The contents of the message to send. The contents can be an object but it must be stringified.
     */
    broadcast(type: string, contents: string): void;
}
