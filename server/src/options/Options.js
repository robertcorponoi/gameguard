'use strict'

const path = require('path');

/**
 * Defines the options available for an instance of GameGuard along with their default values.
 */
module.exports = class Options {

  /**
   * @param {Object} options
   * @param {string} options.db The path where the database file should be saved to.
   */
  constructor(options) {

    /**
     * The path to where the database file should be saved to.
     * 
     * @property {string}
     */
    this.db = path.resolve(process.cwd(), 'db', 'gameguard.db');

    Object.assign(this, options);

  }

};