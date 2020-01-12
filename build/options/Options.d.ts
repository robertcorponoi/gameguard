/**
 * Defines the options available for an instance of GameGuard and their default values.
 */
export default class Options {
    /**
     * The path to where the database file should be saved to.
     *
     * @property {string}
     */
    db: string;
    /**
     * @param {Object} options The options passed to GameGuard on initialization.
     */
    constructor(options: Object);
}
