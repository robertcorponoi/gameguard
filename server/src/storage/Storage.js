'use strict'

const path = require('path');
const Datastore = require('nedb');

/**
 * The Storage module handles storing persistent game data in encrypted files.
 */
module.exports = class Storage {

  /**
   * @param {Options} options The options passed to GameGuard on initialization.
   */
  constructor(options) {

    /**
     * A reference to the options passed to GameGuard on initialization.
     * 
     * @private
     * 
     * @property {Options}
     */
    this._options = options;

    /**
     * A reference to the nedb datastore.
     * 
     * @private
     * 
     * @property {Datastore}
     */
    this._db = new Datastore({ filename: this._options.db, autoload: true });

  }

  /**
   * Adds a player to the banned players list.
   * 
   * @private
   * 
   * @param {string} id The id or IP of the player banned.
   */
  _ban(id) {

    return new Promise((resolve, reject) => {

      const banned = { type: 'ban', id: id };

      this._db.insert(banned, (err) => {

        if (err) reject(err);

        resolve();

      });

    });

  }

  /**
   * Returns the list of banned players.
   * 
   * @private
   * 
   * @returns {Array<string>}
   */
  _banned() {

    return new Promise((resolve, reject) => {

      this._db.find({ type: 'ban' }, { _id: 0, type: 0 }, (err, docs) => {

        if (err) reject(err);

        resolve(docs);

      });

    });

  }

};