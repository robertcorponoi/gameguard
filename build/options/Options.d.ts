/**
 * Defines the options available for an instance of GameGuard and their default values.
 */
export default class Options {
    /**
     * The type of persistent storage to use with GameGuard.
     *
     * The current available options are 'mongodb' or 'local'.
     *
     * @property {string}
     *
     * @default 'local'
     */
    storageMethod: string;
    /**
     * If local storage is chosen, then the path to where the db file should be created can be specified.
     *
     * @property {string}
     *
     * @default `process.cwd()/db/gameguard.db`
     */
    localDbPath: string;
    /**
     * @param {Object} options The options passed to GameGuard on initialization.
     */
    constructor(options: Object);
}
