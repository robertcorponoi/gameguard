'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
exports.default = Player;
