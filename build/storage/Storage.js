'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nedb_1 = __importDefault(require("nedb"));
const mongoose_1 = __importDefault(require("mongoose"));
const hypergiant_1 = __importDefault(require("hypergiant"));
/**
 * The Storage modules handling the storing of persistent server data to an encryped file or database.
 */
class Storage {
    /**
     * @param {Options} options A reference to the options passed to GameGuard on initialization.
     */
    constructor(options) {
        /**
         * The signal that is dispatched when the database is ready to use.
         *
         * @private
         *
         * @property {Hypergiant}
         */
        this._onReady = new hypergiant_1.default();
        this._options = options;
        this._setup();
    }
    /**
     * Sets up the database.
     *
     * @async
     * @private
     */
    _setup() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this._options.storageMethod) {
                case 'mongodb':
                    yield mongoose_1.default.connect('mongodb://localhost/gameguard', {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                    });
                    this._onReady.dispatch();
                    break;
                default:
                    // By default, we use the local storage method.
                    this._db = new nedb_1.default({ filename: this._options.localDbPath, autoload: true });
                    this._onReady.dispatch();
                    break;
            }
        });
    }
    /**
     * Returns the list of currently banned players.
     *
     * @returns {Array<string>}
     */
    banned() {
        return new Promise((resolve, reject) => {
            this._db.find({ type: 'ban' }, (err, docs) => {
                console.log(err, docs);
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
        console.log('are we here', banId);
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
