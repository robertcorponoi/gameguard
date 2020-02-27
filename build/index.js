'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const Rooms_1 = __importDefault(require("./rooms/Rooms"));
const System_1 = __importDefault(require("./system/System"));
const Storage_1 = __importDefault(require("./storage/Storage"));
const Players_1 = __importDefault(require("./players/Players"));
const Options_1 = __importDefault(require("./options/Options"));
const utils_1 = require("./utils/utils");
const ws_1 = __importDefault(require("ws"));
/**
 * A JavaScript game server for managing your game's players and state
 */
module.exports = class GameGuard {
    /**
     * @param {http.Server|https.Server} server The http server instance to bind to.
     * @param {Object} [options]
     * @param {string} [options.dbType='mongodb'] The type of persistent storage to use with GameGuard. The current available options are 'mongodb' or 'mysql'.
     * @param {string} [options.pingTimeout=30000] The interval at which each player is pinged, in milliseconds.
     */
    constructor(server, options = {}) {
        /**
         * A reference to the Rooms module.
         *
         * @private
         *
         * @property {Rooms}
         */
        this._rooms = new Rooms_1.default();
        this._server = server;
        this._options = new Options_1.default(options);
        this._socket = new ws_1.default.Server({ server: this._server, path: '/' });
        this._storage = new Storage_1.default(this._options);
        this._players = new Players_1.default(this._options, this._storage);
        this._system = new System_1.default(this._players);
        this._storage.onReady.add(() => this._boot());
    }
    /**
     * Returns a reference to the Players module.
     *
     * @returns {Players}
     */
    get players() { return this._players; }
    /**
     * Returns a reference to the Rooms module.
     *
     * @returns {Rooms}
     */
    get rooms() { return this._rooms; }
    /**
     * Returns a reference to the System module.
     *
     * @returns {System}
     */
    get system() { return this._system; }
    /**
     * Creates a new message to send to one or more players.
     *
     * @param {string} type The type of message to send.
     * @param {string} contents The contents of the message to send. The contents can be an object but they have to be stringified.
     *
     * @returns {Message} Returns the newly created message.
     */
    /*message(type: string, contents: string): Message {
    return new Message(type, contents);
  }*/
    /**
     * Sets up the WebSocket connection events and initializes all properties of the server instance.
     *
     * @private
     */
    _boot() {
        this._socket.on('connection', (ws, req) => {
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
     * @param {ArrayBuffer} message The stringified message from the client.
     */
    _onmessage(socket, request, message) {
        const messageParsed = utils_1.bufferToMessage(message);
        if (messageParsed.type === 'player-connected') {
            this._storage.isBanned(messageParsed.contents)
                .then((isBanned) => {
                if (isBanned)
                    this.players.reject(messageParsed.contents, socket);
                else
                    this.players.add(messageParsed.contents, socket, request);
                this._socket.removeListener('message', this._onmessage);
            });
        }
    }
};
