'use strict'

/**
 * The structure of a message sent from the client to the GameGuard server.
 */
export default class Message {
    /**
     * The type of message this message is.
     * 
     * @property {string}
     */
    type: string;

    /**
     * The contents of this message.
     * 
     * @property {string}
     */
    contents: (string);

    /**
     * @param {string} type The type of message that this message is.
     * @param {string} contents The contents of this message.
     */
    constructor(type: string, contents: string) {
        this.type = type;
        this.contents = contents;
    }
}