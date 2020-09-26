'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
exports.default = PlayerSchema;
