'use strict'

const http = require('http');
const chai = require('chai');
const sinon = require('sinon');

// Require the GameGuard server files and the MockClient which is used so that
// we don't have to create an actual connection to a web server.
const GameGuard = require('../../build/index');
const MockClient = require('./MockClient');

let server;
let gameGuard;
let mockClient;

// A collection of mock ids to use when creating clients so that we know exactly
// which ids to check.
const ids = [
    '1dfd0497-a2f3-43de-9a55-d965bdde9d70',
    'ac0ab763-49a2-4357-9c99-82b93ec9c699',
    '6b3e6252-1e3b-49e7-b3aa-37c28de8373a',
    '17498408-a1f6-472c-a90e-daf95498e4e0',
    '963318f1-2fee-460d-bf0f-678ab38630ef',
    '20f46588-dbb5-49ba-8ebe-ff73cf8ae974',
    'c7d5e77f-6401-495b-9eaa-d1961f33b965',
    'c63133fe-15bb-4e20-a60e-07615154ef35',
    'fffc4645-21cb-4ff0-9031-be45c185c8d6',
    '202817c6-7035-4cf3-aac4-6a0846cf74ac',
];

// Before all tests are run, we create a basic http server and pass it to a new
// instance of GameGuard since it's required.
before(done => {
    server = http.createServer();
    gameGuard = new GameGuard(server, { heartbeatInterval: 1000000 });
    server.listen(7575, () => done());
});

// After all tests are finished running, we close the server and end the process.
after(done => {
    server.on('close', () => done());

    server.close(() => {
        server.unref();
        process.exit();
    });
});

// Before each test we give ourselves a 5 second timeout so that we can clear the
// database of all players from the previous test.
beforeEach(function (done) {
    this.timeout(5000);
    gameGuard.db.clear().then(() => done());
});

describe('Players', function () {
    describe('Connecting', function () {
        it('should add the connected player to the array of connected players', function (done) {
            this.timeout(10000);

            setTimeout(() => {
                addMockClients(1);

                setTimeout(() => {
                    chai.expect(gameGuard.players.length).to.equal(1);
                    done();
                }, 1000);
            }, 2000);
        });

        it('should create the player data object after a player successfully connects', function (done) {
            this.timeout(10000);

            setTimeout(() => {
                addMockClients(1);

                setTimeout(() => {
                    chai.expect(gameGuard.players[0].ip).to.equal('123.456.0.1') && chai.expect(gameGuard.players[0].id).to.equal('1dfd0497-a2f3-43de-9a55-d965bdde9d70');
                    done();
                }, 1000);
            }, 2000);

            addMockClients(1);
        });

        it('should dispatch a signal when a player connects to the server', function (done) {
            this.timeout(10000);

            const spy = sinon.spy();
            gameGuard.playerConnected.add(spy);

            setTimeout(() => {
                addMockClients(1);

                setTimeout(() => {
                    chai.expect(spy.calledOnce).to.be.true;
                    gameGuard.playerConnected.removeAll();
                    chai.expect(gameGuard.players[0].ip).to.equal('123.456.0.1') && chai.expect(gameGuard.players[0].id).to.equal('1dfd0497-a2f3-43de-9a55-d965bdde9d70');
                    done();
                }, 1000);
            }, 2000);
        });
    });

    describe('Messaging', () => {
        it('should send a message to a connected player', function (done) {
            this.timeout(10000);

            let player;
            gameGuard.playerConnected.add(connectedPlayer => {
                player = connectedPlayer;
                player.message('info', 'hello there!');
            });

            setTimeout(() => {
                addMockClients(1);

                setTimeout(() => {
                    const message = player.ws.messages[0];
                    chai.expect(message.type).to.equal('info') && chai.expect(message.contents).to.equal('hello there!');

                    gameGuard.playerConnected.removeAll();
                    done();
                }, 1000);
            }, 2000);
        });

        it('should send a message to multiple players as they connect', function (done) {
            this.timeout(10000);

            let players = [];
            gameGuard.playerConnected.add(connectedPlayer => {
                players.push(connectedPlayer);
                connectedPlayer.message('debug', 'x: 5');
            });

            setTimeout(() => {
                addMockClients(2);

                setTimeout(() => {
                    chai.expect(players[0].ws.messages[0].type).to.equal('debug');
                    chai.expect(players[0].ws.messages[0].contents).to.equal('x: 5');

                    chai.expect(players[1].ws.messages[0].type).to.equal('debug');
                    chai.expect(players[1].ws.messages[0].contents).to.equal('x: 5');

                    gameGuard.playerConnected.removeAll();
                    done();
                }, 1000);
            }, 2000);
        });
    });

    describe('Kicking', () => {
        it('should dispatch a signal when a player is kicked', function (done) {
            this.timeout(10000);
            const spy = sinon.spy();

            gameGuard.playerConnected.add(player => {
                player.kicked.add(spy);
                player.kick('for testing');
            });

            setTimeout(() => {
                addMockClients(1);

                setTimeout(() => {
                    chai.expect(spy.calledOnce).to.be.true;
                    gameGuard.playerConnected.removeAll();
                    done();
                }, 1000);
            }, 2000);
        });

        it('should kick a player with the default reason', function (done) {
            this.timeout(10000);
            let kickedPlayer;

            gameGuard.playerConnected.add(player => {
                kickedPlayer = player;
                player.kick();
            });

            setTimeout(() => {
                addMockClients(1);

                setTimeout(() => {
                    chai.expect(kickedPlayer.ws.closed).to.deep.equal({ status: true, code: 4002, reason: 'You have been kicked from the GameGuard server' });
                    gameGuard.playerConnected.removeAll();
                    done();
                }, 1000);
            }, 2000);
        });

        it('should kick a player with a custom reason', function (done) {
            this.timeout(10000);
            let kickedPlayer;

            gameGuard.playerConnected.add(player => {
                kickedPlayer = player;
                player.kick('get outta here');
            });

            setTimeout(() => {
                addMockClients(1);

                setTimeout(() => {
                    chai.expect(kickedPlayer.ws.closed).to.deep.equal({ status: true, code: 4002, reason: 'get outta here' });
                    gameGuard.playerConnected.removeAll();
                    done();
                }, 1000);
            }, 2000);
        });

        it('should remove a player from the players array when kicked', function (done) {
            this.timeout(10000);

            gameGuard.playerConnected.add(player => {
                if (player.id === ids[1]) player.kick();
            });

            setTimeout(() => {
                addMockClients(2);

                setTimeout(() => {
                    chai.expect(gameGuard.players.length).to.equal(1);
                    gameGuard.playerConnected.removeAll();
                    done();
                }, 1000);
            }, 2000);
        });
    });

    describe('Banning', () => {
        it('should dispatch a signal when a player is banned', function (done) {
            this.timeout(10000);
            const spy = sinon.spy();

            gameGuard.playerConnected.add(player => {
                player.banned.add(spy);
                player.ban('for testing');
            });

            setTimeout(() => {
                addMockClients(1);

                setTimeout(() => {
                    chai.expect(spy.calledOnce).to.be.true;
                    gameGuard.playerConnected.removeAll();
                    done();
                }, 1000);
            }, 2000);
        });

        it('should ban a player with the default reason', function (done) {
            this.timeout(10000);
            let bannedPlayer;

            gameGuard.playerConnected.add(player => {
                bannedPlayer = player;
                player.ban();
            });

            setTimeout(() => {
                addMockClients(1);

                setTimeout(() => {
                    chai.expect(bannedPlayer.ws.closed).to.deep.equal({ status: true, code: 4003, reason: 'You have been banned from the GameGuard server' });
                    gameGuard.playerConnected.removeAll();
                    done();
                }, 1000);
            }, 2000);
        });

        it('should ban a player with a custom reason', function (done) {
            this.timeout(10000);
            let bannedPlayer;

            gameGuard.playerConnected.add(player => {
                bannedPlayer = player;
                player.ban('get outta here, banned');
            });

            setTimeout(() => {
                addMockClients(1);

                setTimeout(() => {
                    chai.expect(bannedPlayer.ws.closed).to.deep.equal({ status: true, code: 4003, reason: 'get outta here, banned' });
                    gameGuard.playerConnected.removeAll();
                    done();
                }, 1000);
            }, 2000);
        });

        it('should remove a player from the players array when banned', function (done) {
            this.timeout(10000);

            gameGuard.playerConnected.add(player => {
                if (player.id === ids[1]) player.ban();
            });

            setTimeout(() => {
                addMockClients(2);

                setTimeout(() => {
                    chai.expect(gameGuard.players.length).to.equal(1);
                    gameGuard.playerConnected.removeAll();
                    done();
                }, 1000);
            }, 2000);
        });

        it('should ban a player and prevent them from connecting again', function (done) {
            this.timeout(15000);

            const spy = sinon.spy();
            let playerId;
            let playersConnected = 0;

            gameGuard.playerRejected.add(spy);
            gameGuard.playerConnected.add(player => {
                playerId = player.id;
                if (playersConnected < 1) player.ban('for testing');
            });

            setTimeout(() => {
                addMockClients(1);

                setTimeout(() => {
                    addMockClients(1);

                    setTimeout(() => {
                        chai.expect(spy.getCalls()[0].args[0].id).to.equal(ids[0]);
                        gameGuard.playerConnected.removeAll();
                        done();
                    }, 1000);
                }, 5000);
            }, 2000);
        });

        it('should ban a player and set them as banned in the database', function (done) {
            this.timeout(15000);

            const spy = sinon.spy();
            let playerId;
            let playersConnected = 0;

            gameGuard.playerRejected.add(spy);
            gameGuard.playerConnected.add(player => {
                playerId = player.id;
                if (playersConnected < 1) player.ban('for testing');
            });

            setTimeout(() => {
                addMockClients(1);

                setTimeout(() => {
                    addMockClients(1);

                    setTimeout(() => {
                        gameGuard.db.getPlayer(spy.getCalls()[0].args[0].id)
                            .then(pl => {
                                chai.expect(pl.isBanned).to.be.true;
                                gameGuard.playerConnected.removeAll();
                                done();
                            });
                    }, 1000);
                }, 5000);
            }, 2000);
        });
    });
});

describe('Rooms', function () {
    describe('Creating', function () {
        it('should create a room with default capacity of Infinity', function () {
            const room1 = gameGuard.createRoom('room1');

            chai.expect(gameGuard.rooms[0].name).to.equal('room1') && chai.expect(gameGuard.rooms[0].capacity).to.equal(Infinity);
        });

        it('should create a room with a custom capacity of 10', function () {
            gameGuard.rooms = [];
            const room1 = gameGuard.createRoom('room1', 10);

            chai.expect(gameGuard.rooms[0].capacity).to.equal(10);
        });

        it('should create a room and dispatch the roomCreated signal when the room is created', done => {
            gameGuard.rooms = [];
            const spy = sinon.spy();
            gameGuard.roomCreated.add(spy);

            gameGuard.createRoom('room1', 10);
            chai.expect(spy.calledOnce).to.be.true;

            gameGuard.roomCreated.removeAll();

            done();
        });

        it('should include the room data object when the roomCreated signal is dispatched', done => {
            gameGuard.rooms = [];
            const spy = sinon.spy();
            gameGuard.roomCreated.add(spy);

            gameGuard.createRoom('room1', 10);
            chai.expect(spy.getCalls()[0].args[0].name).to.equal('room1');

            gameGuard.roomCreated.removeAll();
            done();
        });

        it('should fail creating a new room with the same name as an existing room', done => {
            gameGuard.rooms = [];
            gameGuard.createRoom('room1');
            gameGuard.createRoom('room1');

            chai.expect(gameGuard.rooms.length).to.equal(1);
            done();
        });
    });

    describe('Destroying', function () {
        it('should destroy a room', function () {
            gameGuard.rooms = [];

            const room1 = gameGuard.createRoom('room1');
            gameGuard.destroyRoom(room1);

            chai.expect(gameGuard.rooms.length).to.equal(0);

            gameGuard.roomDestroyed.removeAll();
        });

        it('should destroy a room and dispatch the roomDestroyed signal when the room is destroyed', done => {
            gameGuard.rooms = [];
            const spy = sinon.spy();
            gameGuard.roomDestroyed.add(spy);

            const room1 = gameGuard.createRoom('room1', 10);
            gameGuard.destroyRoom(room1);
            chai.expect(spy.calledOnce).to.be.true;

            gameGuard.roomDestroyed.removeAll();
            done();
        });
    });

    describe('Adding and Removing Players', function () {
        it('should add a player to a room', function (done) {
            this.timeout(10000);

            gameGuard.rooms = [];
            const room1 = gameGuard.createRoom('room1');

            gameGuard.playerConnected.add(connectedPlayer => room1.addPlayer(connectedPlayer));

            setTimeout(() => {
                addMockClients(1);

                setTimeout(() => {
                    chai.expect(room1.players.length).to.equal(1) && chai.expect(room1.players[0].id).to.equal(ids[0]);
                    done();
                }, 1000);
            }, 2000);
        });

        it('should remove a player from a room', function (done) {
            this.timeout(10000);

            gameGuard.rooms = [];
            let player;
            const room1 = gameGuard.createRoom('room1');

            gameGuard.playerConnected.add(connectedPlayer => {
                player = connectedPlayer;
                room1.addPlayer(connectedPlayer);
            });

            setTimeout(() => {
                addMockClients(1);

                setTimeout(() => {
                    room1.removePlayer(player);
                    chai.expect(room1.players.length).to.equal(0);
                    done();
                }, 1000);
            }, 2000);
        });

        it('should remove all players from a room', function (done) {
            this.timeout(10000);

            gameGuard.rooms = [];
            const room1 = gameGuard.createRoom('room1');

            gameGuard.playerConnected.add(connectedPlayer => room1.addPlayer(connectedPlayer));

            setTimeout(() => {
                addMockClients(5);

                setTimeout(() => {
                    room1.clear();
                    chai.expect(room1.players.length).to.equal(0);
                    done();
                }, 1000);
            }, 2000);
        });
    });

    describe('Messaging', function () {
        it('should broadcast a message to all of the players in a room', function (done) {
            this.timeout(10000);

            gameGuard.rooms = [];
            const players = [];
            const room1 = gameGuard.createRoom('room1');

            gameGuard.playerConnected.add(connectedPlayer => {
                players.push(connectedPlayer);
                room1.addPlayer(connectedPlayer);
            });

            setTimeout(() => {
                addMockClients(2);

                setTimeout(() => {
                    room1.broadcast('info', 'Hello World!');
                    const expected = '{"type":"info","contents":"Hello World!"}';
                    chai.expect(JSON.stringify(players[0].ws.messages[0])).to.equal(expected) && chai.expect(JSON.stringify(players[1].ws.messages[0])).to.equal(expected);
                    done();
                }, 1000);
            }, 2000);
        });
    });
});

describe('System', function () {
    describe('Messaging', function () {
        it('should broadcast a message to all players connected to the server', function (done) {
            this.timeout(10000);

            const players = [];
            gameGuard.playerConnected.add(connectedPlayer => players.push(connectedPlayer));

            setTimeout(() => {
                addMockClients(2);

                setTimeout(() => {
                    gameGuard.broadcast('info', 'Hello World!');
                    const expected = '{"type":"info","contents":"Hello World!"}';
                    chai.expect(JSON.stringify(players[0].ws.messages[0])).to.equal(expected) && chai.expect(JSON.stringify(players[1].ws.messages[0])).to.equal(expected);
                    done();
                }, 1000);
            }, 2000);
        });
    });
});

/**
 * A helper method to make 1 or more fake clients connect to the GameGuard
 * server. This saves us from having to use the browser.
 * 
 * @param {number} [count=1] The number of players that should be connected to the GameGuard server. 
 */
function addMockClients(count = 1) {
    for (let i = 0; i < count; ++i) {
        mockClient = new MockClient(ids[i]);
        gameGuard._socket._events.connection(mockClient, mockClient.req);

        const playerJoined = JSON.stringify({ type: 'player-connected', contents: mockClient.id });
        mockClient.message(playerJoined);
    }
}
