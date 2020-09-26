/**
 * Defines the options available for an instance of GameGuard and their default values.
 */
export default class Options {
    /**
     * The interval at which each player is pinged, in milliseconds.
     *
     * @property {number}
     *
     * @default 30000
     */
    heartbeatInterval: number;
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
     * The max latency, in milliseconds, a player can have before being kicked.
     *
     * @property {number}
     *
     * @default 300
     */
    maxLatency: number;
    /**
     * @param {Object} options The options passed to GameGuard on initialization.
     */
    constructor(options: any);
}
