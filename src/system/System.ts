'use strict'

import Player from '../players/Player';
import Players from '../players/Players';
import Message from '../message/Message';

/**
 * The System module handles system-wide events and actions that apply to all players connected to the server.
 */
export default class System {
  /**
   * A reference to the players module.
   * 
   * @private
   * 
   * @property {Players}
   */
  private _players: Players;

  /**
   * @param {Players} players A reference to the players module.
   */
  constructor(players: Players) {
    this._players = players;
  }

  /**
   * Sends a message to every player in every room.
   * 
   * @param {string} type The type of message to send.
   * @param {string} contents The contents of the message to send. The contents can be an object but it must be stringified.
   */
  broadcast(type: string, contents: string) {
    this._players.connected.map((player: Player) => player.message(type, contents));
  }
}