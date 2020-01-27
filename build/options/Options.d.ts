/**
 * Defines the options available for an instance of GameGuard and their default values.
 */
export default class Options {
    /**
     * The database type to use.
     *
     * Current supported database types are 'mongodb' and 'mysql'.
     *
     * @property {string}
     *
     * @default 'mongodb'
     */
    dbType: string;
    /**
     * @param {Object} options The options passed to GameGuard on initialization.
     */
    constructor(options: Object);
}
