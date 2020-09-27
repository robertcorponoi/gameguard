import Message from './Message';
/**
 * Decodes a message from an ArrayBuffer to a message object.
 *
 * @param {ArrayBuffer} buffer The arraybuffer to decode.
 *
 * @returns {Message} Returns a new message object from the arraybuffer.
 */
export declare function bufferToMessage(buffer: ArrayBuffer): Message;
/**
 * Encodes a message from a message object to an ArrayBuffer.
 *
 * @param {Message} message The message to encode.
 *
 * @returns {ArrayBuffer} Returns the message as an ArrayBuffer.
 */
export declare function messageToBuffer(message: Message): ArrayBuffer;
