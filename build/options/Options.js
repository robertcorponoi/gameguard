'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines the options available for an instance of GameGuard and their default values.
 */
class Options {
    /**
     * @param {Object} options The options passed to GameGuard on initialization.
     */
    constructor(options) {
        /**
         * The database type to use.
         *
         * Current supported database types are 'mongodb' and 'mysql'.
         *
         * @property {string}
         *
         * @default 'mongodb'
         */
        this.dbType = 'mongodb';
        /**
         * The interval at which each player is pinged, in milliseconds.
         *
         * @property {number}
         *
         * @default 30000
         */
        this.pingInterval = 30000;
        /**
         * The interval at which each player's latency is calculated.
         *
         * @property {number}
         *
         * @default 5000
         */
        this.latencyCheckInterval = 5000;
        Object.assign(this, options);
    }
}
exports.default = Options;
