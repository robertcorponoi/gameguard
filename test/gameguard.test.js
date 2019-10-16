'use strict'

const path = require('path');
const http = require('http');
const chai = require('chai');
const sinon = require('sinon');
const fs = require('fs-extra');

const GameGuard = require('../server/src/index');
const MockClient = require('./MockClient/MockClient');

let server;
let gameGuard;
let mockClient;

/**
 * A collection of mock ids to use when creating clients.
 */
const ids = [
  "1dfd0497-a2f3-43de-9a55-d965bdde9d70",
  "ac0ab763-49a2-4357-9c99-82b93ec9c699",
  "6b3e6252-1e3b-49e7-b3aa-37c28de8373a",
  "17498408-a1f6-472c-a90e-daf95498e4e0",
  "963318f1-2fee-460d-bf0f-678ab38630ef",
  "20f46588-dbb5-49ba-8ebe-ff73cf8ae974",
  "c7d5e77f-6401-495b-9eaa-d1961f33b965",
  "c63133fe-15bb-4e20-a60e-07615154ef35",
  "fffc4645-21cb-4ff0-9031-be45c185c8d6",
  "202817c6-7035-4cf3-aac4-6a0846cf74ac",
];

const options = { db: path.resolve(process.cwd(), 'test', 'gameguard.db') };

/**
 * Before any test is run, we create a basic http server and use it to run the game server on.
 */
before(done => {

  server = http.createServer(() => console.log('Server started'));

  gameGuard = new GameGuard(server, options);

  server.listen(7575, () => done());

});

/**
 * After all tests are finished running, we destory the game server object and close the server.
 */
after(done => {

  server.on('close', () => done());

  server.close(() => {

    server.unref();

    process.exit();

  });

});

/**
 * After each test is finished running, we reset some properties of the game server so that they
 * don't mess with other tests.
 */

/**
 * ==============================================================================================
 * PLAYERS
 * ============================================================================================== 
 */
describe('Connecting Players to the Game Server', () => {

  it('should add the player to the Array of connected players when the player connects', done => {

    addMockClients(1);

    setTimeout(() => {

      chai.expect(gameGuard.players._players.length).to.equal(1);

      done();

    }, 1000);

  });

  it('should create the player object saving their id and IP', done => {

    addMockClients(1);

    setTimeout(() => {

      chai.expect(gameGuard.players._players[0].ip).to.equal('123.456.0.1') && chai.expect(gameGuard.players._players[0].id).to.equal('1dfd0497-a2f3-43de-9a55-d965bdde9d70');

      done();

    }, 1000);

  });

  it('should emit and event when the player object is created', done => {

    const spy = sinon.spy();

    gameGuard.players.on('player-joined', spy);

    addMockClients(1);

    setTimeout(() => {

      chai.expect(spy.calledOnce).to.be.true;

      gameGuard.players.removeAllListeners();

      done();

    }, 1000);

  });

});

describe('Sending messages to players', () => {

  it('should send a message to a player', done => {

    gameGuard.players.on('player-joined', player => {

      player.message('info', 'hello there!');

      chai.expect(player._ws.messages[0]).to.equal(`{"type":"info","content":"hello there!"}`);

    });

    addMockClients(1);

    gameGuard.players.removeAllListeners();

    done();

  });

});

describe('Kicking and banning players', () => {

  it('should kick a player', done => {

    const spy = sinon.spy();

    gameGuard.players.on('player-kicked', spy);

    gameGuard.players.on('player-joined', player => player.kick('for testing'));

    addMockClients(1);

    setTimeout(() => {

      chai.expect(spy.calledOnce).to.be.true;

      gameGuard.players.removeAllListeners();

      done();

    }, 1000);

  });

  it('should kick a player with a reason', done => {

    const spy = sinon.spy();

    gameGuard.players.on('player-kicked', spy);

    gameGuard.players.on('player-joined', player => player.kick('for testing'));

    addMockClients(1);

    setTimeout(() => {

      chai.expect(spy.getCalls()[0].args[1]).to.equal('for testing');

      gameGuard.players.removeAllListeners();

      done();

    }, 1000);

  });

  it('should ban a player', done => {

    const spy = sinon.spy();

    gameGuard.players.on('player-banned', spy);

    gameGuard.players.on('player-joined', player => player.ban('for testing'));

    addMockClients(1);

    setTimeout(() => {

      chai.expect(spy.calledOnce).to.be.true;

      gameGuard.players.removeAllListeners();

      done();

    }, 1000);

  });

  it('should ban a player with a reason', done => {

    const spy = sinon.spy();

    gameGuard.players.on('player-banned', spy);

    gameGuard.players.on('player-joined', player => player.ban('for testing'));

    addMockClients(1);

    setTimeout(() => {

      chai.expect(spy.getCalls()[0].args[1]).to.equal('for testing');

      gameGuard.players.removeAllListeners();

      done();

    }, 1000);

  });

  it('should ban a player and add them to the banned players list', async () => {

    gameGuard.players.on('player-joined', player => player.ban('for testing'));

    addMockClients();

    const banned = await gameGuard._storage._banned();

    setTimeout(() => {

      chai.expect(banned[0].id).to.equal('1dfd0497-a2f3-43de-9a55-d965bdde9d70');

      gameGuard.players.removeAllListeners();

    }, 1500);

  });

});

/**
 * ==============================================================================================
 * ROOMS
 * ============================================================================================== 
 */
describe('Creating and destroying rooms', () => {

  it('should create a room with default capacity', () => {

    const room1 = gameGuard.rooms.create('room1');

    chai.expect(gameGuard.rooms.rooms[0].name).to.equal('room1') && chai.expect(gameGuard.rooms.rooms[0].capacity).to.equal(Infinity) && chai.expect(room1.name).to.equal('room1');

  });

  it('should create a room with a capacity of 10', () => {

    gameGuard.rooms._rooms = [];

    gameGuard.rooms.create('room1', 10);

    chai.expect(gameGuard.rooms.rooms[0].name).to.equal('room1') && chai.expect(gameGuard.rooms.rooms[0].capacity).to.equal(10);

  });

  it('should create a room and emit an event when the room is created', done => {

    gameGuard.rooms._rooms = [];

    const spy = sinon.spy();

    gameGuard.rooms.on('room-created', spy);

    gameGuard.rooms.create('room1', 10);

    chai.expect(spy.calledOnce).to.be.true;

    gameGuard.rooms.removeAllListeners();

    done();

  });

  it('should create a room and emit an event when the room is created with the room object', done => {

    gameGuard.rooms._rooms = [];

    const spy = sinon.spy();

    gameGuard.rooms.on('room-created', spy);

    gameGuard.rooms.create('room1', 10);

    chai.expect(spy.getCalls()[0].args[0].name).to.equal('room1');

    gameGuard.rooms.removeAllListeners();

    done();

  });

  it('should fail creating a new room with the same name as an existing room', done => {

    gameGuard.rooms._rooms = [];

    gameGuard.rooms.create('room1');

    chai.expect(() => gameGuard.rooms.create('room1')).to.throw('A room already exists with the name provided');

    done();

  });

  it('should destroy a room', () => {

    gameGuard.rooms._rooms = [];

    gameGuard.rooms.create('room1');

    gameGuard.rooms.destroy('room1');

    chai.expect(gameGuard.rooms.rooms.length).to.equal(0);

  });

  it('should destroy a room and emit an event', done => {

    gameGuard.rooms._rooms = [];

    const spy = sinon.spy();

    gameGuard.rooms.on('room-destroyed', spy);

    gameGuard.rooms.create('room1', 10);

    gameGuard.rooms.destroy('room1');

    chai.expect(spy.calledOnce).to.be.true;

    gameGuard.rooms.removeAllListeners();

    done();

  });

  it('should destroy a room and emit an event with the room name', done => {

    gameGuard.rooms._rooms = [];

    const spy = sinon.spy();

    gameGuard.rooms.on('room-destroyed', spy);

    gameGuard.rooms.create('room1', 10);

    gameGuard.rooms.destroy('room1');

    chai.expect(spy.getCalls()[0].args[0]).to.equal('room1');

    gameGuard.rooms.removeAllListeners();

    done();

  });

});

describe('Adding and removing players from rooms', () => {

  it('should add a player to a room', done => {

    const room1 = gameGuard.rooms.create('room1');

    gameGuard.players.on('player-joined', player => room1.add(player));

    addMockClients();

    setTimeout(() => {

      chai.expect(room1._players.length).to.equal(1) && chai.expect(room1._players[0]._id).to.equal(ids[0]);

      done();

    }, 1500);

  });

  it('should remove a player from a room', done => {

    const players = [];

    gameGuard.rooms._rooms = [];

    const room1 = gameGuard.rooms.create('room1');

    gameGuard.players.on('player-joined', player => {

      room1.add(player);

      players.push(player);

    });

    addMockClients(2);

    setTimeout(() => {

      room1.remove(players[0]);

      chai.expect(room1._players.length).to.equal(1) && chai.expect(room1._players[0]._id).to.equal(ids[1]);

      done();

    }, 1500);

  });

  it('should remove all players from a room', done => {

    gameGuard.rooms._rooms = [];

    const room1 = gameGuard.rooms.create('room1');

    gameGuard.players.on('player-joined', player => room1.add(player));

    addMockClients(2);

    setTimeout(() => {

      room1.clear();

      chai.expect(room1._players.length).to.equal(0);

      done();

    }, 1500);

  });

});

describe('Messaging players in rooms', () => {

  it('should broadcast a message to all of the players in the room', function (done) {

    this.timeout(5000);

    let players = [];

    gameGuard.rooms._rooms = [];

    const broadcastRoom = gameGuard.rooms.create('broadcastRoom');

    gameGuard.players.on('player-joined', player => {

      players.push(player);

      broadcastRoom.add(player);

    });

    addMockClients(2);

    setTimeout(() => {

      broadcastRoom.broadcast('info', 'Hello World!');

      setTimeout(() => {

        chai.expect(players[0]._ws.messages[0]).to.equal('{"type":"info","content":"Hello World!"}') && chai.expect(players[1]._ws.messages[0]).to.equal('{"type":"info","content":"Hello World!"}');

        done();

      }, 3000);

    }, 1500);

  });

});

/**
 * ==============================================================================================
 * SYSTEM
 * ============================================================================================== 
 */
describe('Messaging all players in the server', () => {

  it('should broadcast a message to all of the players in the server', done => {

    addMockClients(2);

    gameGuard.system.broadcast('info', 'Hello World!');

    chai.expect(gameGuard.players._players[0]._ws.messages[0]).to.equal('{"type":"info","content":"Hello World!"}') && chai.expect(gameGuard.players._players[1]._ws.messages[0]).to.equal('{"type":"info","content":"Hello World!"}');

    done();

  });

});

/**
 * Joins one or more mock clients to the game server.
 * 
 * @param {number} [count=1] The number of players to join to the gamae server.
 */
function addMockClients(count = 1) {

  for (let i = 0; i < count; ++i) {

    mockClient = new MockClient(ids[i]);

    gameGuard._socket._events.connection(mockClient, mockClient.req);

    const playerJoined = JSON.stringify({ type: 'player-joined', content: mockClient.id });

    mockClient.message(playerJoined);

  }

}