'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines the options for a mysql connection is mysql is chosen as the database type to use.
 */
class MySqlOptions {
    constructor() {
        /**
         * The db host.
         *
         * @property {string}
         *
         * @default 'localhost'
         */
        this.host = 'localhost';
        /**
         * The db port.
         *
         * @property {number}
         *
         * @default 3306
         */
        this.port = 3306;
        /**
         * The db user to connect as.
         *
         * @property {string}
         
    }
}
exports.default = MySqlOptions;
