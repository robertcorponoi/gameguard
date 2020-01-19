'use strict'

//import Datastore from 'nedb';
import mongoose from 'mongoose';
import Hypergiant from 'hypergiant';

import Options from '../options/Options';

import BannedPlayers from './schemas/BannedPlayers'; 

/**
 * The Storage modules handling the storing of persistent server data to an encryped file or database.
 */
export default class Storage {
  /**
   * A reference to the options passed to GameGuard on initialization.
   * 
   * @private
   * 
   * @property {Options}
   */
  private _options: Options;

  /**
   * A reference to the mongoose connection.
   *
   * @private
   *
   * @property {mongoose.Connection}
   */
  private _db: any;

  /**
   * A reference to the Player model.
   *
   * @private
   *
   * @property {mongoose.Model}
   */
  private _BannedPlayer: any = mongoose.model('BannedPlayers', BannedPlayers);

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
  private _onReady: Hypergiant = new Hypergiant();

  /**
   * @param {Options} options A reference to the options passed to GameGuard on initialization.
   */
  constructor(options: Options) {
    this._options = options;

    this._setup();
  }

  /**
   * Returns the onReady signal.
   *
   * @returns {Hypergiant}
   */
  get onReady(): Hypergiant { return this._onReady; }

  /**
   * Sets up the database.
   * 
   * @async
   * @private
   */
  private async _setup() {
    switch (this._options.storageMethod) {
      case 'mongodb':
        this._db = mongoose.connection;

        this._db.on('error', console.error.bind(console, 'connection error:'));

        this._db.once('open', async () => {
          this._onReady.dispatch();
        });

        await mongoose.connect('mongodb://localhost/gameguard', {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });

        break;
        /*default:
        // By default, we use the local storage method.
        this._db = new Datastore({ filename: this._options.localDbPath, autoload: true });

        this._onReady.dispatch();
        break;*/
    }
  }

  /**
   * Removes all players from the banned players list.
   *
   * This is just for testing.
   */
  private async _clearDb() {
    await this._BannedPlayer.deleteMany({});
  }

  /**
   * Returns all of the players on the banned players list.
   *
   * This is just for testing.
   */
  private async _getBanned() {
    return await this._BannedPlayer.find({});
  }

  /**
   * Bans a player and saves it to the persistent storage.
   *
   * @param {string} playerId The id of the player to ban.
   */
  ban(playerId: string) {
    const bannedPlayer = new this._BannedPlayer({ pid: playerId }); 

    this._BannedPlayer.updateOne(
      { pid: playerId },
      { $setOnInsert: bannedPlayer },
      { upsert: true },
      (err: Error, numAffected: number) => {
        if (err) return console.error(err);
      }
    )
  }

  /**
   * Checks to see if a player id is banned or not.
   *
   * @param {string} playerId The id of the player to check if banned or not.
   *
   * @returns {Promise<boolean>} Returns true if the player has been banned or false otherwise.
   */
  isBanned(playerId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._BannedPlayer.findOne({ pid: playerId }, (err: Error, entry: any) => {
        if (err) reject(err);

        if (entry) resolve(true);
        else resolve(false);
      });
    });
  }
}
