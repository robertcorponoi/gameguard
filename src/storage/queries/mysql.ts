'use strict'

/**
 * Defines the queries used with mysql.
 */  
export function init()  {
  "CREATE TABLE `players` (`id` int(6) NOT NULL, `pid` varchar(36) NOT NULL, `status` varchar(25) NOT NULL)"
};
