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
//import Datastore from 'nedb';
const mongoose_1 = __importDefault(require("mongoose"));
const hypergiant_1 = __importDefault(require("hypergiant"));
const BannedPlayers_1 = __importDefault(require("./schemas/BannedPlayers"));
/**
 * The Storage modules handling the storing of persistent server data to an encryped file or database.
 */
class Storage {
    /**
     * @param {Options} options A reference to the options passed to GameGuard on initialization.
     */
    constructor(options) {
        /**
         * A reference to the Player model.
         *
         * @private
         *
         * @property {mongoose.Model}
         */
        this._BannedPlayer = mongoose_1.default.model('BannedPlayers', BannedPlayers_1.default);
        /**
         * A reference to the nedb datastore.
         *
         * @private
         *
         * @property {Datastore}
         */
        //private _db!: Datastore;
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
     * Returns the onReady signal.
     *
     * @returns {Hypergiant}
     */
    get onReady() { return this._onReady; }
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
                    this._db = mongoose_1.default.connection;
                    console.log(this._db);
                    this._db.on('error', console.error.bind(console, 'connection error:'));
                    this._db.once('open', () => {
                        this._onReady.dispatch();
                        console.log('openened');
                    });
                    break;
                /*default:
                // By default, we use the local storage method.
                this._db = new Datastore({ filename: this._options.localDbPath, autoload: true });
        
                this._onReady.dispatch();
                break;*/
            }
        });
    }
    /**
     * Bans a player and saves it to the persistent storage.
     *
     * @param {string} playerId The id of the player to ban.
     */
    ban(playerId) {
        const bannedPlayer = new this._BannedPlayer({ pid: playerId });
        this._BannedPlayer.update({ pid: playerId }, { $setOnInsert: bannedPlayer }, { upsert: true }, (err, numAffected) => {
            if (err)
                return console.error(err);
        });
    }
    /**
     * Checks to see if a player id is banned or not.
     *
     * @param {string} playerId The id of the player to check if banned or not.
     *
     * @returns {Promise<boolean>} Returns true if the player has been banned or false otherwise.
     */
    isBanned(playerId) {
        return new Promise((resolve, reject) => {
            this._BannedPlayer.findOne({ pid: playerId }, (err, entry) => {
                if (err)
                    reject(err);
                resolve(true);
            });
        });
    }
}
exports.default = Storage;
