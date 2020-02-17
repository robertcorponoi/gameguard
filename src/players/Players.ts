'use strict'

import { performance } from 'perf_hooks';

import Hypergiant from 'hypergiant';

import Player from './Player';
import Options from '../options/Options';
import Storage from '../storage/Storage';
import Message from '../message/Message';

/**
 * The Players module handles managing players as a batch group.
 */
export default class Players {
  /**
   * A reference to the options passed to GameGuard on initialization.
   * 
   * @private
   * 
   * @property {Options}
   */
  private _options: Options;

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
  private _players: Array<Player> = [];

  /**
   * The signal that is dispatched when a player connects to the server.
   *
   * The data contained in this signal is: the player object.
   *
   * @private
   *
   * @property {Hypergiant}
   */
  private _connected: Hypergiant = new Hypergiant();

  /**
   * The signal that is dispatched when a player disconnects from the server.
   *
   * The data contained in this signal is: the player object.
   *
   * @private
   *
   * @property {Hypergiant}
   */
  private _disconnected: Hypergiant = new Hypergiant();

  /**
   * The signal that is dispatched when a player is rejected by the server due to them being banned.
   *
   * The data contained in this signal is: the id of the player that was rejected.
   *
   * @private
   *
   * @property {Hypergiant}
   */
  private _rejected: Hypergiant = new Hypergiant();

  /**
   * The signal that is dispatched when a player is kicked from the server.
   *
   * The data contained in this signal is: the player object and the reason for the kick.
   *
   * @private
   *
   * @property {Hypergiant}
   */
  private _kicked: Hypergiant = new Hypergiant();

  /**
   * The signal that is dispatched when a player is banned from the server.
   *
   * The data contained in this signal is: the player object and the reason for the ban.
   *
   * @private
   *
   * @property {Hypergiant}
   */
  private _banned: Hypergiant = new Hypergiant();

  /**
   * The signal that is dispatched when a player's connection has timed out.
   *
   * @private
   *
   * @property {Hypergiant}
   */
  private _timedOut: Hypergiant = new Hypergiant();

  /**
   * @param {Options} options A reference to the options passed to GameGuard on initialization.
   * @param {Storage} storage A reference to the Storage module.
   */
  constructor(options: Options, storage: Storage) {
    this._options = options;

    this._storage = storage;
  }

  /**
   * Returns all of the players connected to the server.
   * 
   * @returns {Array<Player>}
   */
  get players(): Array<Player> { return this._players; }

  /**
   * Returns the player connected signal.
   *
   * @returns {Hypergiant}
   */
  get connected(): Hypergiant { return this._connected; }

  /**
   * Returns the player disconnected signal.
   *
   * @returns {Hypergiant}
   */
  get disconnected(): Hypergiant { return this._disconnected; }

  /**
   * Returns the player rejected signal.
   *
   * @returns {Hypergiant}
   */
  get rejected(): Hypergiant { return this._rejected; }

  /**
   * Returns the player kicked signal.
   *
   * @returns {Hypergiant}
   */
  get kicked(): Hypergiant { return this._kicked; }

  /**
   * Returns the player banned signal.
   *
   * @returns {Hypergiant}
   */
  get banned(): Hypergiant { return this._banned; }

  /**
   * Returns the player timed out signal.
   *
   * @returns {Hypergiant}
   */
  get timedOut(): Hypergiant { return this._timedOut; }

  /**
   * Adds a player to the list of connected players.
   * 
   * This also dispatches the `connected` signal that contains the Player object as a parameter.
   * 
   * @param {string} id The id of the client connecting to the server.
   * @param {*} socket The WebSocket connection object of the client.
   * @param {*} request The http request object of the client.
   */
  add(id: string, socket: any, request: any) {
    const player: Player = new Player(id, socket, request);

    player.kicked.add((player: Player, reason: string) => this._onkick(player, reason));

    player.banned.add((player: Player, reason: string) => this._onban(player, reason));

    player.socket.on('message', (msg: string) => this._onmessage(player, msg));

    this._createHeartbeatCheck(player);

    this._createLatencyCheck(player);

    this._players.push(player);

    this.connected.dispatch(player);
  }

  /**
   * Automatically rejects a player when banned player attempst to connect.
   *
   * @param {string} id The id of the client connecting to the server.
   * @param {*} socket The WebSocket connection object of the client.
   */
  reject(id: string, socket: any) {
    socket.close(this._options.socketCloseInfo.rejected.code, this._options.socketCloseInfo.rejected.reason);

    this.rejected.dispatch(id);
  }

  /**
   * Remove all listeners from all signals.
   */
  removeAllListeners() {
    this.connected.removeAll();
    this.disconnected.removeAll();
    this.rejected.removeAll();
    this.kicked.removeAll();
    this.banned.removeAll();
  }

  /**
   * Removes a player from the list of connected players.
   * 
   * This also dispatches the `disconnected` signal that contains the Player object as a parameter.
   * 
   * @private
   * 
   * @param {Player} player The player to remove from the list.
   */
  private _remove(player: Player) {
    this._players = this._players.filter((pl: Player) => pl.id !== player.id);

    this.disconnected.dispatch(player);
  }

  /**
   * When a player is kicked, they are removed from the list of connected players.
   * 
   * This also dispatches the `kick` signal that contains the player object and the reason they were kicked as parameters.
   * 
   * @private
   * 
   * @param {Player} player The player that was kicked.
   * @param {string} [reason] The reason as to why the player was kicked.
   */
  private _onkick(player: Player, reason?: string) {
    const closeReason: string = reason ? reason : this._options.socketCloseInfo.kicked.reason;

    player.socket.close(this._options.socketCloseInfo.kicked.code, closeReason);

    this._remove(player);

    this.kicked.dispatch(player, reason);
  }

  /**
   * When a player is banned, they are removed from the list of connected players and added to a persistent banned players list.
   * 
   * This also dispatches the `banned` signal that contains the player object and the reason thye were banned as parameters.
   * 
   * @private
   * 
   * @param {Player} player The player that was banned.
   * @param {string} [reason] The reason as to why the player was banned.
   */
  private _onban(player: Player, reason?: string) {
    const banReason: string = reason ? reason : this._options.socketCloseInfo.banned.reason;

    player.socket.close(this._options.socketCloseInfo.banned.code, banReason);

    this._storage.ban(player.id);

    this._remove(player);

    this.banned.dispatch(player, reason);
  }

  /**
   * When a player's latency exceeds the `maxLatency`, they are automatically kicked from the server.
   *
   * @private
   *
   * @param {Player} player The player that timed out.
   */
  private _ontimedout(player: Player) {
    const timedOutReason: string = this._options.socketCloseInfo.timedOut.reason;

    player.socket.close(this._options.socketCloseInfo.timedOut.code, timedOutReason);

    this._remove(player);

    this.timedOut.dispatch(player);
  }

  /**
   * When a player recieves a message, it's processed here.
   *
   * @private
   *
   * @param {Player} player The player that received the message.
   * @param {string} message The message that was received.
   */
  private _onmessage(player: Player, msg: string) {
    const parsed: any = JSON.parse(msg);

    const message: Message = new Message(parsed.type, parsed.contents);

    switch (message.type) {
      case 'latency-pong':
        const previous: number = parseInt(message.contents);
        const current: number = Date.now();

        player.latency = (current - previous) / 2;

        if (player.latency > this._options.maxLatency) this._ontimedout(player); 

        player.message('latency', `${player.latency}`);
        break;
    }
  }

  /**
   * Creates an interval on the player object for the heartbeat check.
   * 
   * @private
   * 
   * @param {Player} player The player to create the heartbeat check for.
   */
  private _createHeartbeatCheck(player: Player) {
    player.pingIntervalId = setInterval(() => {
      player.ping();
    }, this._options.pingInterval);
  }

  /**
   * Creates an interval on the player object for the latency check.
   * 
   * @private
   * 
   * @param {Player} player The player to create the latency check for.
   */
  private _createLatencyCheck(player: Player) {
    player.pingIntervalId = setInterval(() => {
      const time: string = `${Date.now()}`;

      player.message('latency-ping', time);
    }, this._options.latencyCheckInterval);
  }
}
