'use strict'

import Message from '../message/Message';

/**
 * Decodes a message from an ArrayBuffer to a message object.
 *
 * @param {ArrayBuffer} buffer The arraybuffer to decode.
 *
 * @returns {Message} Returns a new message object from the arraybuffer.
 */
export function bufferToMessage(buffer: ArrayBuffer): Message {
  const decoder: TextDecoder = new TextDecoder('utf8');

  const decoded: string = decoder.decode(buffer);

  const parsed: any = JSON.parse(decoded);

  const message = new Message(parsed.type, parsed.contents);

  return message;
}
