import mongoose from 'mongoose';
import Hypergiant from 'hypergiant';
import Options from '../Options';
/**
 * Handles database operations in mongodb or mysql.
 */
export default class Database {
    /**
     * The options passed to GameGuard on initialization.
     *
     * @property {Options}
     */
    private _options;
    /**
     * A reference to the mongodb connection.
     *
     * @property {mongoose.Connection}
     */
    db: mongoose.Connection;
    /**
     * A reference to the Player model created from the Player schema.
     *
     * @property {mongoose.Model}
     */
    player: mongoose.Model<mongoose.Document, {}>;
    /**
     * The signal that is dispatched when the mongodb is successfully connected
     * to and ready to be used.
     *
     * @property {Hypergiant}
     */
    connected: Hypergiant;
    /**
     * When the Database module is initialized we set up the connection to the
     * database and dispatch the `connected` signal.
     *
     * @param {Options} options The options passed to GameGuard on initialization.
     */
    constructor(options: Options);
    /**
     * Establishes the connection to the database.
     *
     * @private
     */
    private _connect;
    /**
     * Clears all players from the database.
     *
     * @async
     */
    clear(): Promise<void>;
    /**
     * Returns all of the banned players from the database.
     *
     * @async
     *
     * @returns {Promise<Array<Object>>} Returns an array of banned players.
     */
    getBannedPlayers(): Promise<Array<Object>>;
    /**
     * Used to add a new player to the database or to update their properties.
     *
     * @async
     *
     * @param {string} pid The id of the player to add or update.
     * @param {Object} update The properties of the player to update.
     */
    updatePlayer(pid: string, update: Object): Promise<void>;
    /**
     * Gets a player from the database.
     *
     * @async
     *
     * @param {string} pid The id of the player to get from the database.
     *
     * @returns {Promise<Object>} Returns the player from the database.
     */
    getPlayer(pid: string): Promise<Object>;
    /**
     * Sets a player as banned in the database.
     *
     * @async
     *
     * @param {string} pid The id of the player to ban.
     */
    banPlayer(pid: string): Promise<void>;
    /**
     * Sets a player as unbanned in the database.
     *
     * @async
     *
     * @param {string} pid The id of the player to unban.
     */
    unbanPlayer(pid: string): Promise<void>;
}
