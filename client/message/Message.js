'use strict'

/**
 * Represents a message sent by the client to the server.
 * 
 * This provides structure for messages sent along with metadata that can be helpful to the server.
 */
export default class Message {

  /**
   * @param {string} type The type of message that is being sent.
   * @param {string} content The actual contents of the message.
   */
  constructor(type, content) {

    /**
     * The type of message being sent.
     * 
     * @property {string}
     */
    this.type = type;

    /**
     * The actual contents of the message.
     * 
     * @property {string}
     */
    this.content = content;

    /**
     * The timestamp of when this message was created and sent.
     * 
     * @property {number}
     */
    this.timestamp = + new Date();

  }

  /**
   * Prepare this message to be sent by stringifying the contents of it.
   * 
   * @since 0.1.0
   * 
   * @returns {string} Returns the stringified version of this message.
   */
  stringify() {

    const message = { type: this.type, content: this.content, timestamp: this.timestamp };

    return JSON.stringify(message);

  }

}