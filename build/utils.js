'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageToBuffer = exports.bufferToMessage = void 0;
const Message_1 = __importDefault(require("./Message"));
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
    if (!decoded)
        return new Message_1.default('', '');
    const parsed = JSON.parse(decoded);
    const message = new Message_1.default(parsed.type, parsed.contents);
    return message;
}
exports.bufferToMessage = bufferToMessage;
/**
 * Encodes a message from a message object to an ArrayBuffer.
 *
 * @param {Message} message The message to encode.
 *
 * @returns {ArrayBuffer} Returns the message as an ArrayBuffer.
 */
function messageToBuffer(message) {
    const { type, contents } = message;
    return Buffer.from(JSON.stringify({ type, contents }));
}
exports.messageToBuffer = messageToBuffer;
