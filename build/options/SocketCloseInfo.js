'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines the close codes and reasons for those codes that can be used for various actions such as closing, kicking, and banning.
 */
class SocketCloseInfo {
    /**
     * @param {Object} options The options to override the default close event objects.
     */
    constructor(options = {}) {
        /**
         * The code and reason that is sent when the server is closed naturally.
         *
         * @property {SocketClose}
         */
        this.closed = { code: 4001, reason: 'The server has shut down.' };
        /**
         * The code and reason that is sent when the player is kicked from the server.
         *
         * @property {SocketClose}
         */
        this.kicked = { code: 4002, reason: 'You have been kicked from the server.' };
        /**
         * The code and reason that is sent when the player is banned from the server.
         *
         * @property {SocketClose}
         */
        this.banned = { code: 4003, reason: 'You have been banned from the server.' };
        /**
         * The code and reason that is sent when a banned player is attempting to connect to the server and kicked.
         *
         * @property {SocketClose}
         */
        this.rejected = { code: 4004, reason: 'You are banned from the server.' };
        Object.assign(this, options);
    }
}
exports.default = SocketCloseInfo;
