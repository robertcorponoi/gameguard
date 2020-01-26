'use strict'

import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import Hypergiant from 'hypergiant';

import Options from '../options/Options';

import Player from './schemas/Player'; 

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
   * A reference to the mongoose or mysql connection.
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
  private _Player: any = mongoose.model('Player', Player);

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
   * Sets up the mongodb or mysql database.
   * 
   * @async
   *
   * @private
   */
  private async _setup() {
    switch (this._options.dbType) {
      case 'mongodb':
        this._db = mongoose.connection;

        this._db.on('error', console.error.bind(console, 'connection error:'));

        this._db.once('open', async () => {
          this._onReady.dispatch();
        });

        const mongodbName: string = process.env.MONGODB_NAME || 'gameguard';

        await mongoose.connect(`mongodb://localhost/${mongodbName}`, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });

        break;
      case 'mysql':
        const connectionInfo: any = {
          host: process.env.MYSQL_HOST || 'localhost',
          port: process.env.MYSQL_PORT || 3306,
          user: process.env.MYSQL_USER || 'root',
          password: process.env.MYSQL_PASS || '',
          database: process.env.MYSQL_DB || 'gameguard'
        };

        this._db = await mysql.createConnection(connectionInfo);

        try {
          await this._db.execute('SELECT 1 FROM players LIMIT 1');
        } catch (err) {
          await this._db.query('CREATE TABLE players (id INT(6) AUTO_INCREMENT PRIMARY KEY, pid VARCHAR(36) UNIQUE KEY NOT NULL, banned BOOLEAN DEFAULT FALSE);');
        }

        this.onReady.dispatch();
        break;
    }
  }

  /**
   * Removes all players from the banned players list.
   *
   * **Note:** This is used for testing only and shouldn't be used anywhere else.
   */
  private async _clearDb() {
    switch (this._options.dbType) {
      case 'mongodb':
        await this._Player.deleteMany({});
        break;
      case 'mysql':
        await this._db.execute('truncate players');
        break;
    }
  }

  /**
   * Returns all of the players on the banned players list.
   *
   * **Note:** This is used for testing only and shouldn't be used anywhere else.
   */
  private async _getBanned() {
    switch (this._options.dbType) {
      case 'mongodb':
        return await this._Player.find({ banned: true });
        break;
      case 'mysql':
        const [rows, fields] = await this._db.execute('SELECT * FROM `players` WHERE `banned` = ?', [true]);
        return rows;
        break;
    }
  }

  /**
   * Bans a player and saves it to the persistent storage.
   *
   * @param {string} playerId The id of the player to ban.
   */
  ban(playerId: string) {
    switch (this._options.dbType) {
      case 'mongodb':
        const bannedPlayer = new this._Player({ pid: playerId }); 

        this._Player.updateOne(
          { pid: playerId, banned: true },
          { $setOnInsert: bannedPlayer },
          { upsert: true },
          (err: Error, numAffected: number) => {
            if (err) return console.error(err);
          }
        )
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
  isBanned(playerId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._Player.findOne({ pid: playerId, status: 'banned'  }, (err: Error, entry: any) => {
        if (err) reject(err);

        if (entry) resolve(true);
        else resolve(false);
      });
    });
  }
}
