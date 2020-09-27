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
const mongoose_1 = __importDefault(require("mongoose"));
const hypergiant_1 = __importDefault(require("hypergiant"));
const Player_1 = __importDefault(require("./schemas/Player"));
/**
 * Handles database operations in mongodb or mysql.
 */
class Database {
    /**
     * When the Database module is initialized we set up the connection to the
     * database and dispatch the `connected` signal.
     *
     * @param {Options} options The options passed to GameGuard on initialization.
     */
    constructor(options) {
        /**
         * A reference to the Player model created from the Player schema.
         *
         * @property {mongoose.Model}
         */
        this.player = mongoose_1.default.model('Player', Player_1.default);
        /**
         * The signal that is dispatched when the mongodb is successfully connected
         * to and ready to be used.
         *
         * @property {Hypergiant}
         */
        this.connected = new hypergiant_1.default();
        this._options = options;
        this.db = mongoose_1.default.connection;
        this._connect();
    }
    /**
     * Establishes the connection to the database.
     *
     * @private
     */
    _connect() {
        // If there's an error while connecting to the database we want to send
        // out an error message.
        this.db.on('error', console.error.bind(console, 'Connection Error:'));
        // If we have successfully connected to the database then we dispatch the
        // `connected` signal.
        this.db.once('open', () => this.connected.dispatch());
        // Get the connection info from the .env file and use it to establish a
        // connection to mongodb.
        mongoose_1.default.connect(this._options.mongodbConnectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        }).then();
        mongoose_1.default.set('useCreateIndex', true);
    }
    /**
     * Clears all players from the database.
     *
     * @async
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.player.deleteMany({});
        });
    }
    /**
     * Returns all of the banned players from the database.
     *
     * @async
     *
     * @returns {Promise<Array<Object>>} Returns an array of banned players.
     */
    getBannedPlayers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.player.find({ isBanned: true });
        });
    }
    /**
     * Used to add a new player to the database or to update their properties.
     *
     * @async
     *
     * @param {string} pid The id of the player to add or update.
     * @param {Object} update The properties of the player to update.
     */
    updatePlayer(pid, update) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { id: pid };
            const options = { upsert: true, new: true, setDefaultsOnInsert: true };
            yield this.player.findOneAndUpdate(query, update, options).catch((err) => { return err; });
        });
    }
    /**
     * Gets a player from the database.
     *
     * @async
     *
     * @param {string} pid The id of the player to get from the database.
     *
     * @returns {Promise<Object>} Returns the player from the database.
     */
    getPlayer(pid) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { id: pid };
            return yield this.player.findOne(query).catch((err) => { return err; });
        });
    }
    /**
     * Sets a player as banned in the database.
     *
     * @async
     *
     * @param {string} pid The id of the player to ban.
     */
    banPlayer(pid) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { id: pid };
            const update = { isBanned: true };
            yield this.player.updateOne(query, update).catch((err) => { return err; });
        });
    }
    /**
     * Sets a player as unbanned in the database.
     *
     * @async
     *
     * @param {string} pid The id of the player to unban.
     */
    unbanPlayer(pid) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { id: pid };
            const update = { isBanned: false };
            yield this.player.updateOne(query, update).catch((err) => { return err; });
        });
    }
}
exports.default = Database;
