'use strict'

import Hypergiant from 'hypergiant';

import Player from './Player';
import Storage from '../storage/Storage';

/**
 * The Players module handles managing players as a batch group.
 */
export default class Players {
  /**
   * A reference to the Storage module.
   * 
   * @private
   * 
   * @property {Storage}
   */
  private _storage: Storage;

  /**
   * A reference to all of the players that are connected to the server.
   * 
   * @private
   * 
   * @property {Array<Player>}
   */
  private _connected: Array<Player> = [];

  /**
   * The signal that is dispatched when a player connects to the server.
   *
   * The data contained in this signal is: the player object.
   *
   * @private
   *
   * @property {Hypergiant}
   */
  private _playerConnected: Hypergiant = new Hypergiant();

  /**
   * The signal that is dispatched when a player disconnects from the server.
   *
   * The data contained in this signal is: the player object.
   *
   * @private
   *
   * @property {Hypergiant}
   */
  private _playerDisconnected: Hypergiant = new Hypergiant();

  /**
   * The signal that is dispatched when a player is rejected by the server due to them being banned.
   *
   * The data contained in this signal is: the id of the player that was rejected.
   *
   * @private
   *
   * @property {Hypergiant}
   */
  private _playerRejected: Hypergiant = new Hypergiant();

  /**
   * The signal that is dispatched when a player is kicked from the server.
   *
   * The data contained in this signal is: the player object and the reason for the kick.
   *
   * @private
   *
   * @property {Hypergiant}
   */
  private _playerKicked: Hypergiant = new Hypergiant();

  /**
   * The signal that is dispatched when a player is banned from the server.
   *
   * The data contained in this signal is: the player object and the reason for the ban.
   *
   * @private
   *
   * @property {Hypergiant}
   */
  private _playerBanned: Hypergiant = new Hypergiant();

  /**
   * @param {Storage} storage A reference to the Storage module.
   */
  constructor(storage: Storage) {
    this._storage = storage;
  }

  /**
   * Returns all of the players connected to the server.
   * 
   * @returns {Array<Player>}
   */
  get connected(): Array<Player> { return this._connected; }

  /**
   * Returns the player connected signal.
   *
   * @returns {Hypergiant}
   */
  get playerConnected(): Hypergiant { return this._playerConnected; }

  /**
   * Returns the player disconnected signal.
   *
   * @returns {Hypergiant}
   */
  get playerDisconnected(): Hypergiant { return this._playerDisconnected; }

  /**
   * Returns the player rejected signal.
   *
   * @returns {Hypergiant}
   */
  get playerRejected(): Hypergiant { return this._playerRejected; }

  /**
   * Returns the player kicked signal.
   *
   * @returns {Hypergiant}
   */
  get playerKicked(): Hypergiant { return this._playerKicked; }

  /**
   * Returns the player banned signal.
   *
   * @returns {Hypergiant}
   */
  get playerBanned(): Hypergiant { return this._playerBanned; }

  /**
   * Adds a player to the list of connected players.
   * 
   * This also emits the `player-connected` event that contains the Player object as a parameter.
   * 
   * @param {string} id The id of the client connecting to the server.
   * @param {*} socket The WebSocket connection object of the client.
   * @param {*} request The http request object of the client.
   */
  add(id: string, socket: any, request: any) {
    const player: Player = new Player(id, socket, request);

    player.kicked.add((player: Player, reason: string) => this._onkick(player, reason));

    player.banned.add((player: Player, reason: string) => this._onban(player, reason));

    this._connected.push(player);

    this.playerConnected.dispatch(player);
  }

  /**
   * Automatically rejects a player when banned player attempst to connect.
   *
   * @param {string} id The id of the client connecting to the server.
   * @param {*} socket The WebSocket connection object of the client.
   * @param {*} request The http request object of the client.
   */
  reject(id: string, socket: any, request: any) {
    socket.close(4000, 'youre banned fool');

    this.playerRejected.dispatch(id);
  }

  /**
   * Remove all listeners from all signals.
   */
  removeAllListeners() {
    this.playerConnected.removeAll();
    this.playerDisconnected.removeAll();
    this.playerRejected.removeAll();
    this.playerKicked.removeAll();
    this.playerBanned.removeAll();
  }

  /**
   * Removes a player from the list of connected players.
   * 
   * This also emits the `player-disconnected` event that contains the Player object as a parameter.
   * 
   * @private
   * 
   * @param {Player} player The player to remove from the list.
   */
  private _remove(player: Player) {
    this._connected = this._connected.filter((pl: Player) => pl.id !== player.id);

    this.playerDisconnected.dispatch(player);
  }

  /**
   * When a player is kicked, they are removed from the list of connected players.
   * 
   * This also emits a `player-kicked` event that contains the player object and the reason they were kicked as parameters.
   * 
   * @private
   * 
   * @param {Player} player The player that was kicked.
   * @param {string} reason The reason as to why the player was kicked.
   */
  private _onkick(player: Player, reason: string) {
    this._remove(player);

    this.playerKicked.dispatch(player, reason);
  }

  /**
   * When a player is banned, they are removed from the list of connected players and added to a persistent banned players list.
   * 
   * This also emits a `player-banned` event that contains the player object and the reason thye were banned as parameters.
   * 
   * @private
   * 
   * @param {Player} player The player that was banned.
   * @param {string} reason The reason as to why the player was banned.
   */
  private _onban(player: Player, reason: string) {
    this._storage.ban(player.id);

    this._remove(player);

    this.playerBanned.dispatch(player, reason);
  }
}
