'use strict'

const Rooms = require('./rooms/Rooms');
const System = require('./system/System');
const Storage = require('./storage/Storage');
const Players = require('./players/Players');
const Options = require('./options/Options');
const WebSocketServer = require('ws').Server;

/**
 * The server-side component of GameGuard that communicates with the client-side Gameguard client in order to
 * manage the game's players.
 */
module.exports = class GameGuard {

  /**
   * @param {http.Server|https.Server} server The server instance to bind to.
   * @param {Object} [options] The initialization options passed to GameGuard.
   * @param {string} [options.db] The path where the database file should be saved to.
   */
  constructor(server, options = {}) {

    /**
     * A reference to the server instance to bind to.
     * 
     * @private
     * 
     * @property {http.Server|https.Server}
     */
    this._server = server;

    /**
     * A reference to the options passed to GameGuard.
     * 
     * @private
     * 
     * @property {Options}
     */
    this._options = new Options(options);

    /**
     * A reference to the WebSocket connection instance.
     * 
     * @private
     * 
     * @property {WebSocketServer}
     */
    this._socket = new WebSocketServer({ server: this._server, path: '/' });

    /**
     * A reference to the Storage module.
     * 
     * @private
     * 
     * @property {Storage}
     */
    this._storage = new Storage(this._options);

    /**
     * A reference to the Players module.
     * 
     * @property {Players}
     */
    this.players = new Players(this._storage);

    /**
     * A reference to the Rooms module.
     * 
     * @property {Rooms}
     */
    this.rooms = new Rooms();

    /**
     * A reference to the System module.
     * 
     * @property {System}
     */
    this.system = new System(this.players);

    /**
     * Setup the WebSocket connection events and initialize all properties.
     */
    this._boot();

  }

  /**
   * Sets up the WebSocket connection events and initializes all properties of the server instance.
   * 
   * @private
   */
  _boot() {

    this._socket.on('connection', (ws, req) => {

      ws.on('message', (message) => this._onmessage(ws, req, message));

    });

  }

  /**
   * When the server WebSocket receives a message from the client WebSocket, we parse the message and take the
   * necessary action.
   * 
   * @private
   * 
   * @param {WebSocket} ws The WebSocket connection Object of the player that sent the message.
   * @param {Object} req The http request Object of the player that sent the message.
   * @param {string} message The JSON stringified message from the client.
   */
  _onmessage(ws, req, message) {

    const parsed = JSON.parse(message);

    switch (parsed.type) {

      /**
       * A new player has joined the game. This is handled here because the player id needs to be saved client-side so
       * we cannot use the WebSocket connection event.
       */
      case 'player-joined':

      this.players._add(parsed.content, ws, req);
        // this._storage._banned()
        //   .then(players => {

        //     const banned = players.find(player => { return player.id === parsed.content });

        //     if (banned) ws.terminate('Banned');

        //     else this.players._add(parsed.content, ws, req);

        //     // players.map(player => {

        //     //   if (player.id === parsed.content) ws.terminate('banned');

        //     //   else this.players._add(parsed.content, ws, req);

        //     // });

        //   });

        // break;

    }

  }

};