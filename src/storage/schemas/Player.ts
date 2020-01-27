'use strict'

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Defines the structure of a player in the mongoose database.
 *
 * Currently this is just being used to save banned players but it is made to be expanded.
 */
const Player = new Schema({
  /**
   * The id of the player as determined by the client.
   */
  pid: String,

  /**
   * Indicates whether the player is banned or not. 
   */
   banned: Boolean,
});

export default Player;
