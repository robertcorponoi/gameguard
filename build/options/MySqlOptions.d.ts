/**
 * Defines the options for a mysql connection is mysql is chosen as the database type to use.
 */
export default class MySqlOptions {
    /**
     * The db host.
     *
     * @property {string}
     *
     * @default 'localhost'
     */
    host: string;
    /**
     * The db port.
     *
     * @property {number}
     *
     * @default 3306
     */
    port: number;
}
/**
 * The db user to connect as.
 *
 * @property {string}
 
