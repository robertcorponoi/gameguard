'use strict'

import Datastore from 'nedb';

import Options from '../options/Options';

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
   * A reference to the nedb datastore.
   * 
   * @private
   * 
   * @property {Datastore}
   */
  private _db: Datastore;

  /**
   * @param {Options} options A reference to the options passed to GameGuard on initialization.
   */
  constructor(options: Options) {
    this._options = options;

    this._db = new Datastore({ filename: this._options.db, autoload: true });
  }

  /**
   * Returns the list of currently banned players.
   * 
   * @returns {Array<string>}
   */
  banned(): Promise<Array<any>> {
    return new Promise((resolve: any, reject: any) => {
      this._db.find({ type: 'ban' }, { _id: 0, type: 0 }, (err: Error, docs: any) => {
        if (err) reject(err);

        resolve(docs);
      });
    });
  }

  /**
   * Adds a player to the persistent list of banned players.
   * 
   * @param {string} banId The id or ip of the player to ban, depending on what type of ban was chosen.
   */
  ban(banId: string): Promise<any> {
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
  }
}