/**
 * Represents a message sent by the client to the server.
 * 
 * This provides structure for messages sent along with metadata that can be helpful to the server.
 */
class Message {

  /**
   * @param {string} type The type of message that is being sent.
   * @param {string} content The actual contents of the message.
   */
  constructor(type, content) {

    /**
     * The type of message being sent.
     * 
     * @property {string}
     */
    this.type = type;

    /**
     * The actual contents of the message.
     * 
     * @property {string}
     */
    this.content = content;

    /**
     * The timestamp of when this message was created and sent.
     * 
     * @property {number}
     */
    this.timestamp = + new Date();

  }

  /**
   * Prepare this message to be sent by stringifying the contents of it.
   * 
   * @since 0.1.0
   * 
   * @returns {string} Returns the stringified version of this message.
   */
  stringify() {

    const message = { type: this.type, content: this.content, timestamp: this.timestamp };

    return JSON.stringify(message);

  }

}

/**
 * The options available and their default values for an instance of the GameGuard client.
 */
class Options {

  /**
   * @param {Object} [options={}] The initialization parameters passed to the GameGuard client instance. 
   * @param {boolean} [options.secure=false] Indicates whether the websocket will connect to the server with a secure connection or not.
   */
  constructor(options) {

    /**
     *  Indicates whether the websocket will connect to the server with a secure connection or not.
     * 
     * @property {boolean}
     * 
     * @default false
     */
    this.secure = false;

    /**
     * Override the default options with user specified ones if they exist.
     */
    Object.assign(this, options);

  }

}

/**
 * Generates various types of uuids to specifications.
 */
var uuid = {

  /**
   * Generates a v4 compliant uuid.
   * 
   * This is derived from this post: https://stackoverflow.com/a/2117523/4274475
   * 
   * @returns {string} Returns a valid v4 uuid.
   */
  v4() {

    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );

  }

};

/**
 * Provides methods to get, set, or edit data in cookies.
 */
var cookies = {

  /**
   * Gets the value for a specified cookie name.
   * 
   * @param {string} name The name of the cookie to get.
   * 
   * @returns {string} Returns the value of the cookie or an empty string if the cookie does not exist.
   */
  get(name) {

    const cname = `${name}=`;

    const decodedCookie = decodeURIComponent(document.cookie);

    const ca = decodedCookie.split(';');

    for (let c of ca) {

      while (c.charAt(0) == ' ') c = c.substring(1);

      if (c.indexOf(cname) == 0) return c.substring(cname.length, c.length);

    }

    return '';

  },

  /**
   * Sets a new cookie with the desired name, value, and expiration date in days.
   * 
   * @param {string} name The name of the cookie to set.
   * @param {string} value The value of the cookie to set.
   * @param {number} daysToExpire The number of days until this cookie expires.
   */
  set(name, value, daysToExpire) {

    const d = new Date();

    d.setTime(d.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));

    const expires = `expires=${d.toUTCString()}`;

    document.cookie = `${name}=${value};${expires};path=/`;

  }

};

/**
 * Provides methods to set, get, and work with data stored on the client side in cookies.
 */
class ClientData {

  /**
   * Gets the GameGuard player id from the current player, if it doesn't exist then a player id will
   * be assigned to the player and returned.
   * 
   * @returns {string} Returns the player id.
   */
  getPlayerId() {

    let playerId = cookies.get('gameguardPlayerId');

    if (!playerId) {

      playerId = uuid.v4();

      cookies.set('gameguardPlayerId', playerId);

    }

    return playerId;

  }

}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/**
 * Compare two functions by turning them into strings and
 * removing whitespace/line-breaks and then checking equality.
 * 
 * @since 0.1.0
 * 
 * @param {Function} fn1 The first function.
 * @param {Function} fn2 The second function.
 * 
 * @returns {boolean} Returns true if the functions are equal and false otherwise.
 */

function compareFunctions(fn1, fn2) {
  var f1 = fn1.toString().replace(/\n/g, '').replace(/\s{2}/g, ' ');
  var f2 = fn2.toString().replace(/\n/g, '').replace(/\s{2}/g, ' ');
  if (f1 === f2) return true;
  return false;
}

var Listener =
/**
 * The function that will be called when the listener is processed.
 * 
 * @property {Function}
 */

/**
 * The context to use when calling this listener.
 * 
 * @property {*}
 */

/**
 * Whether or not this listener will be automatically destroyed after being run once.
 * 
 * @property {boolean}
 */

/**
 * Keeps track of the number of times that this listener has been called.
 * 
 * @property {number} 
 */
function Listener(fn, ctx, once) {
  _classCallCheck(this, Listener);

  _defineProperty(this, "fn", void 0);

  _defineProperty(this, "ctx", void 0);

  _defineProperty(this, "once", void 0);

  _defineProperty(this, "timesCalled", 0);

  this.fn = fn;
  this.ctx = ctx;
  this.once = once;
};

/**
 * Eventverse is a higly performant and easy to use event emitter for Nodejs and the browser.
 * 
 * @author Robert Corponoi <robertcorponoi@gmail.com>
 */

var Eventverse =
/*#__PURE__*/
function () {
  /**
   * The maximum amount of listeners each event can have at one time.
   * 
   * @property {number}
   * 
   * @default 10
   */

  /**
   * A collection of all of the listeners created for this instance of Eventverse.
   * 
   * @property {Object}
   */

  /**
   * @param {number} [maxListenerCount=10] The maximum amount of listeners each event can have at one time. 
   */
  function Eventverse() {
    var maxListenerCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

    _classCallCheck(this, Eventverse);

    _defineProperty(this, "maxListenerCount", void 0);

    _defineProperty(this, "events", Object.create(null));

    this.maxListenerCount = maxListenerCount;
  }
  /**
   * Returns the number of listeners for a given event.
   * 
   * @param {string} event The name of the event.
   * 
   * @returns {number}
   */


  _createClass(Eventverse, [{
    key: "listenerCount",
    value: function listenerCount(event) {
      return this.events[event].length;
    }
    /**
     * Returns the number of times a listener was called.
     * 
     * @param {string} event The name of the event to get the times called for.
     * 
     * @returns {number} Returns the number of times the event was called.
     */

  }, {
    key: "timesCalled",
    value: function timesCalled(event) {
      return this.events[event][0].timesCalled;
    }
    /**
     * Runs all of the listeners attached to this Eventverse with the event name and with the supplied arguments.
     * 
     * @param {string} event The name of the event to emit.
     * @param {...*} args The arguments to pass to the listeners.
     */

  }, {
    key: "emit",
    value: function emit(event) {
      if (!this.exists(event)) return;
      var listeners = this.events[event];

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _listener$fn;

          var listener = _step.value;

          (_listener$fn = listener.fn).call.apply(_listener$fn, [listener.ctx].concat(args));

          listener.timesCalled++;
          if (listener.once) this.removeListener(event, listener.fn);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    /**
     * Adds a listener function for the given event.
     * 
     * 
     * @param {string} event The name of the event to add a listener for.
     * @param {Function} fn The function to run when the event is emitted.
     * @param {Object} context The context to use when calling the listener.
     * @param {boolean} once Indicates whether this listener should only be called once.
     * 
     * @returns {Eventverse}
     */

  }, {
    key: "addListener",
    value: function addListener(event, fn) {
      var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;
      var once = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var listener = new Listener(fn, context, once);

      if (!this.exists(event)) {
        this.events[event] = [];
      } else if (this.events[event].length === this.maxListenerCount) {
        console.warn("[Eventverse][addListener]: The event ".concat(event, " already has the max amount of listeners."));
        return;
      }

      this.events[event].push(listener);
      return this;
    }
    /**
     * Removes a listener function for the given event.
     * 
     * @param {string} event The name of the event to remove the listener on.
     * @param {Function} listener The listener to remove from the event.
     * 
     * @returns {Eventverse}
     */

  }, {
    key: "removeListener",
    value: function removeListener(event, listener) {
      var _this = this;

      if (!this.exists(event)) {
        console.warn('[Eventverse][removeListener]: Unable to remove listener for an event that doesnt exist.');
        return;
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        var _loop = function _loop() {
          var eventListener = _step2.value;

          if (compareFunctions(eventListener.fn, listener)) {
            _this.events[event] = _this.events[event].filter(function (evListener) {
              return evListener != eventListener;
            });
            return "break";
          }
        };

        for (var _iterator2 = this.events[event][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _ret = _loop();

          if (_ret === "break") break;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return this;
    }
    /**
     * Removes all listeners from a given event.
     * 
     * @param {string} event The name of the event to remove all listeners from.
     * 
     * @returns {Eventverse}
     */

  }, {
    key: "removeAllListeners",
    value: function removeAllListeners(event) {
      if (!this.exists(event)) {
        console.warn('[Eventverse][removeAllListeners]: Unable to remove listener for an event that doesnt exist.');
        return;
      }

      this.events[event] = [];
      return this;
    }
    /**
     * Add a listener function that will only run once.
     * 
     * @param {string} event The name of the event to add a listener for.
     * @param {Function} fn The function to run when the event is emitted.
     * @param {Object} [context=this] The context to use when calling the listener.
     * 
     * @returns {Eventverse}
     */

  }, {
    key: "once",
    value: function once(event, fn) {
      var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;
      this.addListener(event, fn, context, true);
      return this;
    }
    /**
     * Adds a listener function for the given event.
     * 
     * @param {string} event The name of the event to add a listener for.
     * @param {Function} fn The function to run when the event is emitted.
     * @param {Object} [context=this] The context to use when calling the listener.
     * 
     * @returns {Eventverse}
     */

  }, {
    key: "on",
    value: function on(event, fn) {
      var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;
      this.addListener(event, fn, context);
      return this;
    }
    /**
     * Checks if an event exists.
      * 
     * @private
     * 
     * @param {string} event The name of the event.
     * 
     * @returns {boolean} Returns true if the event exists or false otherwise.
     */

  }, {
    key: "exists",
    value: function exists(event) {
      if (this.events[event]) return true;
      return false;
    }
  }]);

  return Eventverse;
}();

/**
 * The GameGuard client is used to establish a connection to the server send player info.
 */
class GameGuardClient extends Eventverse {

  /**
   * @param {Object} [options] The initialization parameters passed to this instance.
   * @param {boolean} [options.secure=false] Indicates whether the websocket will connect to the server with a secure connection or not.
   */
  constructor(options = {}) {

    super();

    /**
     * A reference to this client's options.
     * 
     * @private
     * 
     * @property {Options}
     */
    this._options = new Options(options);

    /**
     * A reference to this client's WebSocket connection.
     * 
     * @private
     * 
     * @property {WebSocket}
     */
    this._socket = null;

    /**
     * A reference to the ClientData module.
     * 
     * @private
     * 
     * @property {ClientData}
     */
    this._clientData = new ClientData();

    this._boot();

  }

  /**
   * Initialize the WebSocket connection and all of the events that we need to respond to.
   * 
   * @private
   */
  _boot() {

    this._socket = new WebSocket('ws://localhost:3000/');

    this._socket.addEventListener('open', () => this._onOpen());

    this._socket.addEventListener('message', (message) => this._onMessage(message));

    this._socket.addEventListener('close', (ev) => this._onClose(ev));

  }

  /**
   * When the WebSocket connection opens, we check to see if they are an existing GameGuard player using cookies
   * and if they are not then they are assigned a new GameGuard player id.
   * 
   * @private
   */
  _onOpen() {

    const playerId = this._clientData.getPlayerId();

    const message = new Message('player-joined', playerId);

    this._socket.send(message.stringify());

    this.emit('open', playerId);

  }

  /**
   * TODO:
   * 
   * @param {string} message The message Object received from the server.
   */
  _onMessage(message) {

    const parsed = JSON.parse(message.data);

    const msg = new Message(parsed.type, parsed.content);

    this.emit('message', msg);

  }

  /**
   * When the WebSocket connection closes, we end the players connection to the game and notify them why, if a reason
   * was provided.
   * 
   * @property {Event} ev The WebSocket close event Object.
   */
  _onClose(ev) {

    this.emit('close', ev);

  }

}

export default GameGuardClient;
