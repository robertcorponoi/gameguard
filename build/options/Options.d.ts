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
     * The interval at which each player is pinged, in milliseconds.
     *
     * @property {number}
     *
     * @default 30000
     */
    pingInterval: number;
    /**
     * The interval at which each player's latency is calculated.
     *
     * @property {number}
     *
     * @default 5000
     */
    latencyCheckInterval: number;
    /**
     * @param {Object} options The options passed to GameGuard on initialization.
     */
    constructor(options: Object);
}
