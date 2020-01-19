'use strict'

const EventEmitter = require('events').EventEmitter;

/**
 * The Mock Client is used to test interactions between a real client and the GameGuard game server.
 */
module.exports = class MockClient extends EventEmitter {
  /**
   * @param {string} id The id to use for this mock client.
   */
  constructor(id) {
    super();

    /**
     * The id of this mock client.
     * 
     * @property {string}
     */
    this.id = id;

    /**
     * A mock http request Object for this mock client.
     * 
     * For the purposes of the mock client, all this needs for now is just an IP address.
     * 
     * @property {Object}
     */
    this.req = { headers: { 'x-forwarded-for': '123.456.0.1' } };

    /**
     * An Array of messages received from the game server.
     * 
     * @property {Array<Object>}
     */
    this.messages = [];

    /**
     * Indicates whether this mock client's connection is currently closed or not. 
     * 
     * If the mock client's connection is closed, this also contains the reason why.
     * 
     * @property {Object}
     */
    this.closed = { status: false, code: 0, reason: '' };
  }

  /**
   * Emits a message event that can be picked up by the game server.
   * 
   * @param {string} message The stringified message Object to send to the game server.
   */
  message(message) {
    this.emit('message', message, this, this.req);
  }

  /**
   * Accepts a message from the game server and adds it to the `messages` property.
   * 
   * @param {string} message The message received from the game server.
   */
  send(message) {
    this.messages.push(message);
  }

  /**
   * Closes the mock client's connection to the game server.
   *
   * @param {string} reason The reason as to why the mock client's connection was closed.
   */
  close(code, reason) {
    this.closed = { status: true, code: code, reason: reason };
  }
};
