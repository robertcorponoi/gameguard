import Player from './Player';
/**
 * A room is a collection of players that can receive actions together.
 */
export default class Room {
    /**
     * The name of the room.
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
     * The players that are in the room.
     *
     * @private
     *
     * @property {Array<Player>}
     */
    private _players;
    /**
     * @param {string} name The name of the room.
     * @param {number} capacity The maximum number of players that can be in this room.
     */
    constructor(name: string, capacity: number);
    /**
     * Returns the name of the room.
     *
     * @returns {string}
     */
    get name(): string;
    /**
     * Returns the capcity of the room.
     *
     * @returns {number}
     */
    get capacity(): number;
    /**
     * Returns the players in the room.
     *
     * @returns {Array<Player>}
     */
    get players(): Player[];
    /**
     * Returns the current number of players in the room.
     *
     * @returns {number}
     */
    get playerCount(): number;
    /**
     * Sets a new capacity for the room. If the new capacity is lower than the
     * current number of players in the room, the capcity will not be changed.
     *
     * @param {number} newCapacity The new capacity for the room.
     */
    set capacity(newCapacity: number);
    /**
     * Adds a player to the room if the room is not at full capacity. If it is at full
     * capacity then a warning will be logged and the player will not be added.
     *
     * @param {Player} player The player to add to the room.
     */
    addPlayer(player: Player): void;
    /**
     * Removes a player from the room.
     *
     * @param {Player} player The player to remove from the room.
     */
    removePlayer(player: Player): void;
    /**
     * Removes all players from the room.
     */
    clear(): void;
    /**
     * Sends a message to every player in the room.
     *
     * @param {string} type The type of message to send.
     * @param {contents} contents The contents of the message to send.
     */
    broadcast(type: string, contents: string): void;
}
