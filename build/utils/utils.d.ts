import Message from '../message/Message';
/**
 * Decodes a message from an ArrayBuffer to a message object.
 *
 * @param {ArrayBuffer} buffer The arraybuffer to decode.
 *
 * @returns {Message} Returns a new message object from the arraybuffer.
 */
export declare function bufferToMessage(buffer: ArrayBuffer): Message;
