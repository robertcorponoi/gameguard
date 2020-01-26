import mongoose from 'mongoose';
/**
 * Defines the structure of a player in the mongoose database.
 *
 * Currently this is just being used to save banned players but it is made to be expanded.
 */
declare const Player: mongoose.Schema<any>;
export default Player;
