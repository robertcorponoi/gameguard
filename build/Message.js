'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The structure of a message sent from the client to the GameGuard server.
 */
class Message {
    /**
     * @param {string} type The type of message that this message is.
     * @param {string} contents The contents of this message.
     */
    constructor(type, contents) {
        this.type = type;
        this.contents = contents;
    }
}
exports.default = Message;
