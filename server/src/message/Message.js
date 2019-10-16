'use strict'

/**
 * A message represents the structure of a message sent by the server to the client or from the client
 * to the server.
 */
module.exports = class Message {

  /**
   * @param {string} type The type of message that this message is.
   * @param {string} message The message to send to the client.
   */
  constructor(type, message) {

    /**
     * The type of message that this message is.
     * 
     * @property {string}
     */
    this.type = type;

    /**
     * The message to send to the client.
     * 
     * @proeprty {string}
     */
    this.content = message;

  }

};