import SocketCloseInfo from './SocketCloseInfo';
/**
 * Defines the options available for an instance of GameGuard and their default values.
 */
export default class Options {
    /**
     * The database type to use.
     *
     * Current supported database types are 'mongodb' and 'mysql'.
     *
     * @property {string}
     *
     * @default 'mongodb'
     */
    dbType: string;
    /**
     * The interval at which each player is pinged, in milliseconds.
     *
     * @property {number}
     *
     * @default 30000
     */
    pingInterval: number;
    /**
     * The interval at which each player's latency is calculated, in milliseconds.
     *
     * Note that this is a minimum check interval, checks might be sent more often with messages to converse resources but the checks will happen at least every x milliseconds as specified here.
     *
     * @property {number}
     *
     * @default 5000
     */
    latencyCheckInterval: number;
    /**
     *
     * Defines the close codes and reasons for those codes that can be used for various actions such as closing, kicking, and banning.
     *
     * When kicking or banning a player, these are used if no reason is provided.
     *
     * @property {socketCloseInfo}
     */
    socketCloseInfo: SocketCloseInfo;
    /**
     * @param {Object} options The options passed to GameGuard on initialization.
     */
    constructor(options: any);
}
