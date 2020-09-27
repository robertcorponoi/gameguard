'use strict'

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Defines the structure of a player in mongodb.
 */
const PlayerSchema = new Schema({
    /**
     * The id of the player as determined by the client.
     */
    id: String,

    /**
     * This player's username.
     */
    username: String,

    /**
     * The timestamp of when the player last connected to the GameGuard server.
     */
    lastConnectedAt: Date,

    /**
     * Indicates whether the player is banned or not. 
     */
    isBanned: {
        type: Boolean,
        default: false,
    },
});

PlayerSchema.index({ 'username': 'text' });

export default PlayerSchema;
