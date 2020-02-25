'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = __importDefault(require("../message/Message"));
/**
 * Decodes a message from an ArrayBuffer to a message object.
 *
 * @param {ArrayBuffer} buffer The arraybuffer to decode.
 *
 * @returns {Message} Returns a new message object from the arraybuffer.
 */
function bufferToMessage(buffer) {
    const decoder = new TextDecoder('utf8');
    const decoded = decoder.decode(buffer);
    const parsed = JSON.parse(decoded);
    const message = new Message_1.default(parsed.type, parsed.contents);
    return message;
}
exports.bufferToMessage = bufferToMessage;
