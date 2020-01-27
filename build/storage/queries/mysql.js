'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines the queries used with mysql.
 */
function init() {
    "CREATE TABLE `players` (`id` int(6) NOT NULL, `pid` varchar(36) NOT NULL, `status` varchar(25) NOT NULL)";
}
exports.init = init;
;
