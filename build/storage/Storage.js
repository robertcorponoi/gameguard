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
const promise_1 = __importDefault(require("mysql2/promise"));
const mongoose_1 = __importDefault(require("mongoose"));
const hypergiant_1 = __importDefault(require("hypergiant"));
const Player_1 = __importDefault(require("./schemas/Player"));
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
        this._Player = mongoose_1.default.model('Player', Player_1.default);
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
     * Sets up the mongodb or mysql database.
     *
     * @async
     *
     * @private
     */
    _setup() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this._options.dbType) {
                case 'mongodb':
                    this._db = mongoose_1.default.connection;
                    this._db.on('error', console.error.bind(console, 'connection error:'));
                    this._db.once('open', () => __awaiter(this, void 0, void 0, function* () {
                        this._onReady.dispatch();
                    }));
                    const mongodbName = process.env.MONGODB_NAME || 'gameguard';
                    yield mongoose_1.default.connect(`mongodb://localhost/${mongodbName}`, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                    });
                    break;
                case 'mysql':
                    const connectionInfo = {
                        host: process.env.MYSQL_HOST || 'localhost',
                        port: process.env.MYSQL_PORT || 3306,
                        user: process.env.MYSQL_USER || 'root',
                        password: process.env.MYSQL_PASS || '',
                        database: process.env.MYSQL_DB || 'gameguard'
                    };
                    this._db = yield promise_1.default.createConnection(connectionInfo);
                    try {
                        yield this._db.execute('SELECT 1 FROM players LIMIT 1');
                    }
                    catch (err) {
                        yield this._db.query('CREATE TABLE players (id INT(6) AUTO_INCREMENT PRIMARY KEY, pid VARCHAR(36) UNIQUE KEY NOT NULL, banned BOOLEAN DEFAULT FALSE);');
                    }
                    this.onReady.dispatch();
                    break;
            }
        });
    }
    /**
     * Removes all players from the banned players list.
     *
     * **Note:** This is used for testing only and shouldn't be used anywhere else.
     */
    _clearDb() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this._options.dbType) {
                case 'mongodb':
                    yield this._Player.deleteMany({});
                    break;
                case 'mysql':
                    yield this._db.execute('truncate players');
                    break;
            }
        });
    }
    /**
     * Returns all of the players on the banned players list.
     *
     * **Note:** This is used for testing only and shouldn't be used anywhere else.
     */
    _getBanned() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this._options.dbType) {
                case 'mongodb':
                    return yield this._Player.find({ banned: true });
                    break;
                case 'mysql':
                    const [rows, fields] = yield this._db.execute('SELECT * FROM `players` WHERE `banned` = ?', [true]);
                    return rows;
                    break;
            }
        });
    }
    /**
     * Bans a player and saves it to the persistent storage.
     *
     * @param {string} playerId The id of the player to ban.
     */
    ban(playerId) {
        switch (this._options.dbType) {
            case 'mongodb':
                const bannedPlayer = new this._Player({ pid: playerId });
                this._Player.updateOne({ pid: playerId, banned: true }, { $setOnInsert: bannedPlayer }, { upsert: true }, (err, numAffected) => {
                    if (err)
                        return console.error(err);
                });
                break;
            case 'mysql':
                this._db.execute('INSERT INTO players (`pid`, `banned`) VALUES (?, true)', [playerId]);
                break;
        }
    }
    /**
     * Checks to see if a player id is banned or not.
     *
     * @param {string} playerId The id of the player to check if banned or not.
     *
     * @returns {Promise<boolean>} Returns true if the player has been banned or false otherwise.
     */
    isBanned(playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this._options.dbType) {
                case 'mongodb':
                    return new Promise((resolve, reject) => {
                        this._Player.findOne({ pid: playerId, banned: true }, (err, entry) => {
                            if (err)
                                reject(err);
                            if (entry)
                                resolve(true);
                            else
                                resolve(false);
                        });
                    });
                    break;
                case 'mysql':
                    const [rows, fields] = yield this._db.execute('SELECT 1 FROM players where `pid` = ? AND `banned` = ? LIMIT 1;', [playerId, true]);
                    if (rows.length > 0)
                        return true;
                    return false;
                    break;
            }
        });
    }
}
exports.default = Storage;
