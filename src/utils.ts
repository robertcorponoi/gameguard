'use strict'

import Message from './Message';

/**
 * Decodes a message from an ArrayBuffer to a message object.
 *
 * @param {ArrayBuffer} buffer The arraybuffer to decode.
 *
 * @returns {Message} Returns a new message object from the arraybuffer.
 */
export function bufferToMessage(buffer: ArrayBuffer): Message {
    const decoder = new TextDecoder('utf8');
    const decoded = decoder.decode(buffer);
    if (!decoded) return new Message('', '');

    const parsed = JSON.parse(decoded);
    const message = new Message(parsed.type, parsed.contents);

    return message;
}

/**
 * Encodes a message from a message object to an ArrayBuffer.
 * 
 * @param {Message} message The message to encode.
 * 
 * @returns {ArrayBuffer} Returns the message as an ArrayBuffer.
 */
export function messageToBuffer(message: Message): ArrayBuffer {
    const { type, contents } = message;
    return Buffer.from(JSON.stringify({ type, contents }));
}