'use strict'

/**
 * A Message represents a structured piece of data received from the GameGuard client or sent to the GameGuard client.
 * 
 * The GameGuard client has a similar Message object to ensure that messages sent between the two are consistent.
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