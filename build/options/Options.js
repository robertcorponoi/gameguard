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
         * The interval at which each player's latency is calculated, in milliseconds.
         *
         * Note that this is a minimum check interval, checks might be sent more often with messages to converse resources but the checks will happen at least every x milliseconds as specified here.
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
