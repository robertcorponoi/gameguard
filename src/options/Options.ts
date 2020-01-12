'use strict'

import path from 'path';

/**
 * Defines the options available for an instance of GameGuard and their default values.
 */
export default class Options {
  /**
   * The path to where the database file should be saved to.
   * 
   * @property {string}
   */
  db: string = path.resolve(process.cwd(), 'db', 'gameguard.db');

  /**
   * @param {Object} options The options passed to GameGuard on initialization.
   */
  constructor(options: Object) {
    Object.assign(this, options);
  }
}