'use strict'

import SocketClose from '../interfaces/SocketClose';

/**
 * Defines the close codes and reasons for those codes that can be used for various actions such as closing, kicking, and banning.
 */
export default class SocketCloseInfo {
  /**
   * The code and reason that is sent when the server is closed naturally.
   * 
   * @property {SocketClose}
   */
  closed: SocketClose = { code: 4001, reason: 'The server has shut down.' };

  /**
   * The code and reason that is sent when the player is kicked from the server.
   * 
   * @property {SocketClose}
   */
  kicked: SocketClose = { code: 4002, reason: 'You have been kicked from the server.' };

  /**
   * The code and reason that is sent when the player is banned from the server.
   * 
   * @property {SocketClose}
   */
  banned: SocketClose = { code: 4003, reason: 'You have been banned from the server.' };

  /**
   * The code and reason that is sent when a banned player is attempting to connect to the server and kicked.
   * 
   * @property {SocketClose}
   */
  rejected: SocketClose = { code: 4004, reason: 'You are banned from the server.' };

  /**
   * The code and reason that is sent when the player's latency exceeds the `maxLatency` option value.
   *
   * @property {SocketClose}
   */
  timedOut: SocketClose = { code: 4005, reason: 'You have been kicked from the server for high latency.' };

  /**
   * @param {Object} options The options to override the default close event objects.
   */
  constructor(options: Object = {}) {
    Object.assign(this, options);
  }
}
