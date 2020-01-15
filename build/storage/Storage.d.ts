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
     * A reference to the nedb datastore.
     *
     * @private
     *
     * @property {Datastore}
     */
    private _db;
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
     * Sets up the database.
     *
     * @async
     * @private
     */
    private _setup;
    /**
     * Returns the list of currently banned players.
     *
     * @returns {Array<string>}
     */
    banned(): Promise<Array<any>>;
    /**
     * Adds a player to the persistent list of banned players.
     *
     * @param {string} banId The id or ip of the player to ban, depending on what type of ban was chosen.
     */
    ban(banId: string): Promise<any>;
}
