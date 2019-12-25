'use strict'

/**
 * Attempts to mock the GameGuard server as best as possible on the front-end so that client side tests can be run.
 */
export default class MockServer {

    /**
     * @param {WebSocket} ws A reference to the client's websocket connection.
     */
    constructor(ws) {

        /**
         * A reference to the client's websocket connection.
         * 
         * @property {ws}
         */
        this.ws = ws;

    }

    /**
     * 'Kicks' the player from the server.
     * 
     * @param {string} reason The reason the player is kicked from the server.
     */
    playerKick(reason) {

        this.ws.close(4000, reason);

    }

}
