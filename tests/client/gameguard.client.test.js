'use strict'

import GameGuardClient from './gameguardclient.js';
import MockServer from './MockServer/MockServer.js';

let gg;
let mockserver;

let lastPlayerId;

beforeEach(() => {
    
    gg = new GameGuardClient();

    mockserver = new MockServer(gg._socket);

});

afterEach(() => {
    
    gg = null;

});

describe('Connecting to the GameGuard server', () => {

    it('should create a new playerId for a new client', done => {

        deleteAllCookies();

        gg.on('open', playerId => {
            lastPlayerId = playerId;

            chai.expect(playerId).to.not.be.null;

            done();
        });

    });

    it('should save the last player id of the player in the cookie storage and use it again', done => {

        gg.on('open', playerId => {
            chai.expect(playerId).to.equal(lastPlayerId);

            done();
        });

    });

});

describe('Kicking and banning the player', () => {

    it('should give a reason why the player was kicked when the player is kicked by the server', done => {

        gg.on('close', reason => {
            chai.expect(reason).to.not.be.null;

            done();
        });

        mockserver.playerKick();

    });

});

function deleteAllCookies() {
    const cookies = document.cookie.split(";");

    cookies.map(cookie => {
        const eqPos = cookie.indexOf("=");

        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    })
};