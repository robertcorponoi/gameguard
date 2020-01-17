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
        await mongoose.connect('mongodb://localhost/gameguard', {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });

        this._db = mongoose.connection;

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
  }

  /**
   * Bans a player and saves it to the persistent storage.
   *
   * @param {string} playerId The id of the player to ban.
   */
  ban(playerId: string) {
    const bannedPlayer = new this._BannedPlayer({ pid: playerId }); 

    this._BannedPlayer.update(
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

        resolve(true);
      });
    });
  }

  /**
   * Returns the list of currently banned players.
   * 
   * @returns {Array<string>}
   */
    /*banned(): Promise<Array<any>> {
    return new Promise((resolve: any, reject: any) => {
      this._db.find({ type: 'ban' }, (err: Error, docs: any) => {
console.log(err, docs);
        if (err) reject(err);
        resolve(docs);
      });
    });
  }*/

  /**
   * Adds a player to the persistent list of banned players.
   * 
   * @param {string} banId The id or ip of the player to ban, depending on what type of ban was chosen.
   */
    /*ban(banId: string): Promise<any> {

    console.log('are we here', banId);
    return new Promise((resolve: any, reject: any) => {
      const entry: Object = {
        type: 'ban',
        id: banId
      };

      this._db.insert(entry, (err: Error) => {
        if (err) reject(err);

        resolve();
      });
    });
  }*/
}
