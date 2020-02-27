/**
 * A Message represents a structured piece of communication between the client and server.
 *
 * Every message sent to and received from the client has the same structure.
 */
export default class Message {
    /**
     * The type of message that this message is.
     *
     * @property {string}
     */
    type: string;
    /**
     * The contents of this message.
     *
     * @property {strnig}
     */
    contents: string;
    /**
     * The binary representation of this message.
     *
     * @property {ArrayBuffer}
     */
    binary: ArrayBuffer;
    /**
     * @param {string} type The type of message that this message is.
     * @param {string} message The contents of this message.
     */
    constructor(type: string, contents: string);
    /**
     * Converts the message to binary.
     *
     * @private
     *
     * @returns {ArrayBuffer} Returns the binary representation of this message.
     */
    private _toBinary;
}
