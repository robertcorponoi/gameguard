'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A Message represents a structured piece of communication between the client and server.
 *
 * Every message sent to and received from the client has the same structure.
 */
class Message {
    /**
     * @param {string} type The type of message that this message is.
     * @param {string} message The contents of this message.
     */
    constructor(type, contents) {
        this.type = type;
        this.contents = contents;
    }
}
exports.default = Message;
