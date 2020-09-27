'use strict'

import mongoose from 'mongoose';
import Hypergiant from 'hypergiant';
import PlayerSchema from './schemas/Player';
import Options from '../Options';

/**
 * Handles database operations in mongodb or mysql.
 */
export default class Database {
    /**
     * The options passed to GameGuard on initialization.
     * 
     * @property {Options}
     */
    private _options: Options;

    /**
     * A reference to the mongodb connection.
     * 
     * @property {mongoose.Connection}
     */
    db: mongoose.Connection;

    /**
     * A reference to the Player model created from the Player schema.
     * 
     * @property {mongoose.Model}
     */
    player = mongoose.model('Player', PlayerSchema);

    /**
     * The signal that is dispatched when the mongodb is successfully connected
     * to and ready to be used.
     * 
     * @property {Hypergiant}
     */
    connected = new Hypergiant();

    /**
     * When the Database module is initialized we set up the connection to the
     * database and dispatch the `connected` signal.
     * 
     * @param {Options} options The options passed to GameGuard on initialization.
     */
    constructor(options: Options) {
        this._options = options;
        this.db = mongoose.connection;
        this._connect();
    }

    /**
     * Establishes the connection to the database.
     * 
     * @private
     */
    private _connect() {
        // If there's an error while connecting to the database we want to send
        // out an error message.
        this.db.on('error', console.error.bind(console, 'Connection Error:'));

        // If we have successfully connected to the database then we dispatch the
        // `connected` signal.
        this.db.once('open', () => this.connected.dispatch());

        // Get the connection info from the .env file and use it to establish a
        // connection to mongodb.
        mongoose.connect(this._options.mongodbConnectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        }).then();
        mongoose.set('useCreateIndex', true);
    }

    /**
     * Clears all players from the database.
     * 
     * @async
     */
    async clear() {
        await this.player.deleteMany({});
    }

    /**
     * Returns all of the banned players from the database.
     * 
     * @async
     * 
     * @returns {Promise<Array<Object>>} Returns an array of banned players.
     */
    async getBannedPlayers(): Promise<Array<Object>> {
        return await this.player.find({ isBanned: true });
    }

    /**
     * Used to add a new player to the database or to update their properties.
     * 
     * @async
     * 
     * @param {string} pid The id of the player to add or update.
     * @param {Object} update The properties of the player to update.
     */
    async updatePlayer(pid: string, update: Object) {
        const query = { id: pid };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        await this.player.findOneAndUpdate(query, update, options).catch((err: Error) => { return err; });
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
    async getPlayer(pid: string): Promise<Object> {
        const query = { id: pid };
        return await this.player.findOne(query).catch((err: Error) => { return err; });
    }

    /**
     * Sets a player as banned in the database.
     * 
     * @async
     * 
     * @param {string} pid The id of the player to ban.
     */
    async banPlayer(pid: string) {
        const query = { id: pid };
        const update = { isBanned: true };
        await this.player.updateOne(query, update).catch((err: Error) => { return err; });
    }

    /**
     * Sets a player as unbanned in the database.
     * 
     * @async
     * 
     * @param {string} pid The id of the player to unban.
     */
    async unbanPlayer(pid: string) {
        const query = { id: pid };
        const update = { isBanned: false };
        await this.player.updateOne(query, update).catch((err: Error) => { return err; });
    }
}