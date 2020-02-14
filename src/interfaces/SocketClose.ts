'use strict'

/**
 * Describes the structure of the object that is sent when the player's connection to the server is closed.
 */
export default interface SocketClose {
  /**
   * The code for this close event.
   */
  code: number;

  /**
   * The reason as to why the player's connection was closed.
   */
  reason: string;
}