'use strict'

require('dotenv').config();

import Rooms from './rooms/Rooms';
import System from './system/System';
import Storage from './storage/Storage';
import Players from './players/Players';
import Options from './options/Options';
import Message from './message/Message';

import ws from 'ws';
import http from 'http';
import https from 'https';

/**
 * A JavaScript game server for managing your game's players and state
 */
module.exports = class GameGuard {
  /**
   * A reference to the http server instance to bind to.
   * 
   * @private
   * 
   * @property {http.Server|https.Server}
   */
  private _server: (http.Server | https.Server);

  /**
   * A reference to the options passed to GameGuard.
   * 
   * @private
   * 
   * @property {Options}
   */
  private _options: Options;

  /**
   * A reference to the WebSocket connection instance.
   * 
   * @private
   * 
   * @property {ws.Server}
   */
  private _socket: ws.Server;

  /**
   * A reference to the Storage module.
   * 
   * @private
   * 
   * @property {Storage}
   */
  private _storage: Storage;

  /**
   * A reference to the Players module.
   * 
   * @private
   * 
   * @property {Players}
   */
  private _players: Players;

  /**
   * A reference to the Rooms module.
   * 
   * @private
   * 
   * @property {Rooms}
   */
  private _rooms: Rooms = new Rooms();

  /**
   * A reference to the System module.
   * 
   * @private
   * 
   * @property {System}
   */
  private _system: System;

  /**
   * @param {http.Server|https.Server} server The http server instance to bind to.
   * @param {Object} [options]
   * @param {string} [options.dbType='mongodb'] The type of persistent storage to use with GameGuard. The current available options are 'mongodb' or 'mysql'.
   * @param {string} [options.pingTimeout=30000] The interval at which each player is pinged, in milliseconds.
   */
  constructor(server: (http.Server | https.Server), options: Object) {
    this._server = server;

    this._options = new Options(options);

    this._socket = new ws.Server({ server: this._server, path: '/' });

    this._storage = new Storage(this._options);

    this._players = new Players(this._options, this._storage);

    this._system = new System(this._players);

    this._storage.onReady.add(() => this._boot());
  }

  /**
   * Returns a reference to the Players module.
   * 
   * @returns {Players}
   */
  get players(): Players { return this._players; }

  /**
   * Returns a reference to the Rooms module.
   * 
   * @returns {Rooms}
   */
  get rooms(): Rooms { return this._rooms; }

  /**
   * Returns a reference to the System module.
   * 
   * @returns {System}
   */
  get system(): System { return this._system; }

  /**
   * Creates a new message to send to one or more players.
   * 
   * @param {string} type The type of message to send.
   * @param {string} contents The contents of the message to send. The contents can be an object but they have to be stringified.
   * 
   * @returns {Message} Returns the newly created message.
   */
  message(type: string, contents: string): Message {
    return new Message(type, contents);
  }

  /**
   * Sets up the WebSocket connection events and initializes all properties of the server instance.
   * 
   * @private
   */
  private _boot() {
    this._socket.on('connection', (ws: any, req: any) => {
      ws.on('message', this._onmessage.bind(this, ws, req));
    });
  }

  /**
   * When the server receives a message from the client, we parse it and take an action depending on the type of message it is.
   * 
   * @private
   * 
   * @param {*} socket The WebSocket connection object of the client that sent the message.
   * @param {*} request The http request object of the client that sent the message.
   * @param {string} message The stringified message from the client.
   */
  private _onmessage(socket: any, request: any, message: string) {
    const messageObject: any = JSON.parse(message);

    const messageParsed: Message = new Message(messageObject.type, messageObject.contents);

    if (messageParsed.type === 'player-connected') {
      this._storage.isBanned(messageParsed.contents)
        .then((isBanned) => {
          if (isBanned) this.players.reject(messageParsed.contents, socket);
          else this.players.add(messageParsed.contents, socket, request);

          this._socket.removeListener('message', this._onmessage);
        });
    }
  }
}
