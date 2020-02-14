import SocketClose from '../interfaces/SocketClose';
/**
 * Defines the close codes and reasons for those codes that can be used for various actions such as closing, kicking, and banning.
 */
export default class SocketCloseEvents {
    /**
     * The code and reason that is sent when the server is closed naturally.
     *
     * @property {SocketClose}
     */
    closed: SocketClose;
    /**
     * The code and reason that is sent when the player is kicked from the server.
     *
     * @property {SocketClose}
     */
    kicked: SocketClose;
    /**
     * The code and reason that is sent when the player is banned from the server.
     *
     * @property {SocketClose}
     */
    banned: SocketClose;
    /**
     * The code and reason that is sent when a banned player is attempting to connect to the server and kicked.
     *
     * @property {SocketClose}
     */
    rejected: SocketClose;
    /**
     * @param {Object} options The options to override the default close event objects.
     */
    constructor(options: Object);
}
