'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const ws_1 = __importDefault(require("ws"));
const hypergiant_1 = __importDefault(require("hypergiant"));
const Room_1 = __importDefault(require("./Room"));
const Player_1 = __importDefault(require("./Player"));
const Options_1 = __importDefault(require("./Options"));
const Database_1 = __importDefault(require("./db/Database"));
const utils_1 = require("./utils");
/**
 * A JavaScript game server for managing your game's players and state
 */
module.exports = class GameGuard {
    /**
     * @param {http.Server|https.Server} server The http server instance to bind to.
     * @param {Object} [options] The options to pass to GameGuard on initialization.
     */
    constructor(server, options = {}) {
        /**
         * Keeps track of all of the connected players so that their sockets can be used
         * to send messages.
         *
         * @property {Array<Player>}
         */
        this.players = [];
        /**
         * Keeps track of all of the rooms.
         *
         * @param {Array<Room>}
         */
        this.rooms = [];
        /**
         * The signal that gets dispatched when a player successfully connects to the
         * GameGuard server. This signal will pass the player object as a parameter.
         *
         * @property {Hypergiant}
         */
        this.playerConnected = new hypergiant_1.default();
        /**
         * The signal that gets dispatched when a player disconnects from the GameGuard
         * server. This signal will pass the player's id, close code, and reason as the
         * parameters.
         *
         * @property {Hypergiant}
         */
        this.playerDisconnected = new hypergiant_1.default();
        /**
         * The signal that gets dispatched when a player is rejected from connecting to
         * the GameGuard server because they are banned. This signal will pass the player's
         * database record as a parameter.
         *
         * @property {Hypergiant}
         */
        this.playerRejected = new hypergiant_1.default();
        /**
         * The signal that gets dispatched when a room is created. This signal will pass the
         * room object as a parameter.
         *
         * @property {Hypergiant}
         */
        this.roomCreated = new hypergiant_1.default();
        /**
         * The signal that gets dispatched when a room is destroyed.
         *
         * @property {Hypergiant}
         */
        this.roomDestroyed = new hypergiant_1.default();
        // Assign the http server to the `_server` property.
        this._server = server;
        this._socket = new ws_1.default.Server({ server: this._server, path: '/' });
        // Create the options object from the passed options.
        this._options = new Options_1.default(options);
        // Set up the database connection and then wait for the connection to be open
        // before we proceed.
        this.db = new Database_1.default();
        this.db.connected.add(() => this._boot());
    }
    /**
     * Called when the database connection has been successfully set up to set up the
     * responses to the WebSocket events.
     *
     * @private
     */
    _boot() {
        this._socket.on('connection', (ws, req) => {
            // When a client makes a connection to the GameGuard server, we have to watch
            // for messages and especially the message that lets us know if they're a new
            // or returning player. the player data object and save it to the database.
            ws.on('message', (event) => this._onmessage(event, ws, req));
            // When the client disconnects from the GameGuard server we want to dispatch
            // the `playerdisconnected` signal.
            ws.on('close', (event) => this._onplayerdisconnected(event));
        });
    }
    /**
     * Broadcasts a message to all players connected to the GameGuard server.
     *
     * @param {string} type The type of message to send.
     * @param {string} contents The contents of the message to send.
     */
    broadcast(type, contents) {
        this.players.forEach(player => player.message(type, contents));
    }
    /**
     * Creates a new room and returns it.
     *
     * @param {string} name The name of the room to create.
     * @param {number} [capacity=Infinity] The maximum number of players that can be in the room.
     *
     * @return {Room} Returns the created room.
     */
    createRoom(name, capacity = Infinity) {
        const roomExists = this.rooms.find(room => room.name == name);
        if (roomExists) {
            console.warn('A room with the provided name already exists, skipping.');
            return;
        }
        const room = new Room_1.default(name, capacity);
        this.rooms.push(room);
        this.roomCreated.dispatch(room);
        return room;
    }
    /**
     * Destroys an existing room.
     *
     * @param {Room} room The room object of the room to destroy.
     */
    destroyRoom(room) {
        this.rooms = this.rooms.filter(r => r !== room);
        this.roomDestroyed.dispatch(room);
    }
    /**
     * Called when a message is sent from the GameGuard client to the GameGuard server.
     *
     * @param {ws.MessageEvent} event The message event from the GameGuard client.
     * @param {GameGuardWebSocket} ws The client's WebSocket connection data.
     * @param {http.IncomingMessage} req The player's client request data.
     */
    _onmessage(event, ws, req) {
        // First we need to turn the message from an ArrayBuffer into a message object.
        const message = utils_1.bufferToMessage(event);
        // The only message we care about here is the one where the GameGuard client sends
        // us the player's id.
        if (message.type === 'player-connected')
            this._onplayerconnected(message.contents, ws, req);
    }
    /**
     * Called when the client sends a 'player-connected' message. Here we add the player
     * to the database if they don't exist yet and emit the playerconnected signal.
     *
     * @private
     *
     * @param {GameGuardWebSocket} ws The player's WebSocket connection data.
     * @param {http.IncomingMessage} req The player's client request data.
     * @param {string} contents The contents of the player-joined message.
     */
    _onplayerconnected(contents, ws, req) {
        // First we create their record in the database if it doesn't already exist.
        this.db.updatePlayer(contents, { id: contents, lastConnectedAt: new Date() });
        // Get the most probably ip address of the player which should be the x-forwarded-for
        // property but if not then we fall back on remoteAddress.
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // We want to remove our previous listeners as the player will take over from here.
        ws.removeAllListeners();
        // Next we set up the methods to respond to various player events such as them being
        // kicked from the server.
        const player = new Player_1.default(contents, ip, ws);
        player.kicked.add((p) => this._removePlayer(p));
        player.banned.add((p) => this._banPlayer(p));
        player.ws.on('close', () => this.playerDisconnected.dispatch(player));
        // Now we need to set up the two interval timers: One to ping the player every so often
        // depending on the `pingInterval` option and another to send messages back and forth to
        // the player to measure the latency.
        player.createHearbeatCheck(this._options.heartbeatInterval);
        player.createLatencyCheck(this._options.latencyCheckInterval);
        // Now, we want to see if this player is banned or not before we let them
        // connect to the server.
        this.db.getPlayer(contents)
            .then((dbPlayer) => {
            if (dbPlayer.isBanned) {
                // If the player is banned then we call `reject` on them to close their
                // connection and let them know that their connection has been rejected.
                player.reject();
                // Dispatch the `playerRejected` signal with the Player object.
                this.playerRejected.dispatch(dbPlayer);
            }
            else {
                // If the player isn't banned then we add them to the list of connected
                // players and dispatch the `playerconnected` signal.
                this.players.push(player);
                this.playerConnected.dispatch(player);
            }
        });
    }
    /**
     * Called when the player disconnects from the GameGuard server for any reason. Here
     * is where we emit the playerdisconnected signal.
     *
     * @private
     *
     * @param {ws.CloseEvent} event The close event from the WebSocket.
     */
    _onplayerdisconnected(event) {
        this.playerDisconnected.dispatch(event.code, event.reason);
    }
    /**
     * Removes a player from the current list of players.
     *
     * @private
     *
     * @param {Player} player The player to remove from the list of players.
     */
    _removePlayer(player) {
        this.players = this.players.filter((pl) => pl.id !== player.id);
    }
    /**
     * Called when a player is banned so that they can be set as banned in the database and
     * removed from the list of players.
     *
     * @private
     *
     * @param {Player} player The player that was banned.
     */
    _banPlayer(player) {
        this.db.banPlayer(player.id);
        this._removePlayer(player);
    }
};
