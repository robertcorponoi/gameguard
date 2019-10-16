'use strict'

/**
 * The options available and their default values for an instance of the GameGuard client.
 */
export default class Options {

  /**
   * @param {Object} [options={}] The initialization parameters passed to the GameGuard client instance. 
   * @param {boolean} [options.secure=false] Indicates whether the websocket will connect to the server with a secure connection or not.
   */
  constructor(options) {

    /**
     *  Indicates whether the websocket will connect to the server with a secure connection or not.
     * 
     * @property {boolean}
     * 
     * @default false
     */
    this.secure = false;

    /**
     * Override the default options with user specified ones if they exist.
     */
    Object.assign(this, options);

  }

}