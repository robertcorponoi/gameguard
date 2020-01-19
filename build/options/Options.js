'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
/**
 * Defines the options available for an instance of GameGuard and their default values.
 */
class Options {
    /**
     * @param {Object} options The options passed to GameGuard on initialization.
     */
    constructor(options) {
        /**
         * The type of persistent storage to use with GameGuard.
         *
         * The current available options are 'mongodb' or 'local'.
         *
         * @property {string}
         *
         * @default 'local'
         */
        this.storageMethod = 'mongodb';
        /**
         * If local storage is chosen, then the path to where the db file should be created can be specified.
         *
         * @property {string}
         *
         * @default `process.cwd()/db/gameguard.db`
         */
        this.localDbPath = path_1.default.resolve(process.cwd(), 'db', 'gameguard.db');
        Object.assign(this, options);
    }
}
exports.default = Options;
