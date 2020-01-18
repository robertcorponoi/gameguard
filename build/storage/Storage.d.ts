import Hypergiant from 'hypergiant';
import Options from '../options/Options';
/**
 * The Storage modules handling the storing of persistent server data to an encryped file or database.
 */
export default class Storage {
    /**
     * A reference to the options passed to GameGuard on initialization.
     *
     * @private
     *
     * @property {Options}
     */
    private _options;
    /**
     * A reference to the mongoose connection.
     *
     * @private
     *
     * @property {mongoose.Connection}
     */
    private _db;
    /**
     * A reference to the Player model.
     *
     * @private
     *
     * @property {mongoose.Model}
     */
    private _BannedPlayer;
    /**
     * A reference to the nedb datastore.
     *
     * @private
     *
     * @property {Datastore}
     */
    /**
     * The signal that is dispatched when the database is ready to use.
     *
     * @private
     *
     * @property {Hypergiant}
     */
    private _onReady;
    /**
     * @param {Options} options A reference to the options passed to GameGuard on initialization.
     */
    constructor(options: Options);
    /**
     * Returns the onReady signal.
     *
     * @returns {Hypergiant}
     */
    get onReady(): Hypergiant;
    /**
     * Sets up the database.
     *
     * @async
     * @private
     */
    private _setup;
    /**
     * Removes all players from the banned players list.
     *
     * This is just for testing.
     */
    private _clearDb;
    /**
     * Bans a player and saves it to the persistent storage.
     *
     * @param {string} playerId The id of the player to ban.
     */
    ban(playerId: string): void;
    /**
     * Checks to see if a player id is banned or not.
     *
     * @param {string} playerId The id of the player to check if banned or not.
     *
     * @returns {Promise<boolean>} Returns true if the player has been banned or false otherwise.
     */
    isBanned(playerId: string): Promise<boolean>;
}
