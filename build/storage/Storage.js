'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nedb_1 = __importDefault(require("nedb"));
/**
 * The Storage modules handling the storing of persistent server data to an encryped file or database.
 */
class Storage {
    /**
     * @param {Options} options A reference to the options passed to GameGuard on initialization.
     */
    constructor(options) {
        this._options = options;
        this._db = new nedb_1.default({ filename: this._options.db, autoload: true });
    }
    /**
     * Returns the list of currently banned players.
     *
     * @returns {Array<string>}
     */
    banned() {
        return new Promise((resolve, reject) => {
            this._db.find({ type: 'ban' }, { _id: 0, type: 0 }, (err, docs) => {
                if (err)
                    reject(err);
                resolve(docs);
            });
        });
    }
    /**
     * Adds a player to the persistent list of banned players.
     *
     * @param {string} banId The id or ip of the player to ban, depending on what type of ban was chosen.
     */
    ban(banId) {
        return new Promise((resolve, reject) => {
            const entry = {
                type: 'ban',
                id: banId
            };
            this._db.insert(entry, (err) => {
                if (err)
                    reject(err);
                resolve();
            });
        });
    }
}
exports.default = Storage;
