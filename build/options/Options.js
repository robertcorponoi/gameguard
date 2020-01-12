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
         * The path to where the database file should be saved to.
         *
         * @property {string}
         */
        this.db = path_1.default.resolve(process.cwd(), 'db', 'gameguard.db');
        Object.assign(this, options);
    }
}
exports.default = Options;
