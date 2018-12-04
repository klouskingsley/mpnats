(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Nats = factory());
}(this, (function () { 'use strict';

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

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  var SUB = 'SUB';
  var UNSUB = 'UNSUB';
  var PUB = 'PUB';
  var SPC = ' ';
  var CR_LF = '\r\n';
  var MSG = /^MSG\s+([^\s\r\n]+)\s+([^\s\r\n]+)\s+(([^\s\r\n]+)[^\S\r\n]+)?(\d+)\r\n/i;
  var OK = /^\+OK\s*\r\n/i;
  var ERR = /^-ERR\s+('.+')?\r\n/i;
  var PING = /^PING\r\n/i;
  var PONG = /^PONG\r\n/i;
  var INFO = /^INFO\s+([^\r\n]+)\r\n/i;
  var PONG_RESPONSE = 'PONG' + CR_LF;

  function encode_utf8(s) {
    s = s || '';
    return unescape(encodeURIComponent(s));
  }

  function bytes_size(str) {
    var m = encodeURIComponent(str).match(/%[89ABab]/g);
    return str.length + (m ? m.length : 0);
  }

  function substr_utf8_bytes(str, startInBytes, lengthInBytes) {
    str = str || '';
    var resultStr = '';
    var startInChars = 0,
        bytePos,
        end,
        ch,
        n,
        realLength;
    realLength = encode_utf8(str).length;
    lengthInBytes = realLength < lengthInBytes + startInBytes ? realLength - startInBytes : lengthInBytes;

    for (bytePos = 0; bytePos < startInBytes; startInChars++) {
      ch = str.charCodeAt(startInChars);
      bytePos += ch < 128 ? 1 : encode_utf8(str[startInChars]).length;
    }

    end = startInChars + lengthInBytes - 1;

    for (n = startInChars; startInChars <= end; n++) {
      ch = str.charCodeAt(n);
      end -= ch < 128 ? 1 : encode_utf8(str[n]).length;
      resultStr += str[n];
    }

    return resultStr;
  }

  var Core =
  /*#__PURE__*/
  function () {
    function Core(option) {
      _classCallCheck(this, Core);

      this.option = option;
      this.reuseTopic = !!(option && option.reuseTopic);
      this.connectUrl = '';
      this.socket = null;
      this.subMsgMap = {};
      this.uid = 0;
      this.pendingMsg = '';
    }

    _createClass(Core, [{
      key: "connect",
      value: function connect(_ref) {
        var url = _ref.url;

        if (this.socket) {
          throw new Error('Please close it when you want to connect');
        }

        this.connectUrl = url;
        this.socket = new Core.Socket({
          url: url
        });
        this.socket.onmessage = this._onMessage.bind(this);
        this.socket.onerror = this._onError.bind(this);
        this.socket.onclose = this._onClose.bind(this);
        return this.socket.connect();
      }
    }, {
      key: "close",
      value: function close() {
        var socket = this.socket;

        if (socket) {
          this.subMsgMap = {};
          this.connectUrl = '';
          this.uid = 0;
          this.socket = null;
          this.pendingMsg = '';
          socket.close();
        }
      }
    }, {
      key: "subscribe",
      value: function subscribe(topic, callback) {
        var sid = ++this.uid;
        this.subMsgMap[sid] = {
          sid: sid,
          topic: topic,
          callback: callback
        };
        var msg = [SUB, topic, sid + CR_LF].join(SPC);
        this.socket.send(msg);
        return sid;
      }
    }, {
      key: "unsubscribe",
      value: function unsubscribe(sid) {
        if (this.subMsgMap[sid]) {
          this.subMsgMap[sid] = null;
          var msg = [UNSUB, sid + CR_LF].join(SPC);
          this.socket.send(msg);
        }
      }
    }, {
      key: "publish",
      value: function publish(topic) {
        var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        if (typeof message != 'string') throw new TypeError('publish(topic, message): message must be string type');
        var msg = [PUB, topic, bytes_size(message) + CR_LF + message + CR_LF].join(SPC);
        this.socket.send(msg);
      }
    }, {
      key: "request",
      value: function request() {}
    }, {
      key: "flush",
      value: function flush() {}
    }, {
      key: "timeout",
      value: function timeout() {}
    }, {
      key: "_onMessage",
      value: function _onMessage(data) {
        // console.log('on msg', data)
        var msg;
        var m;
        var topic;
        var sid;
        var nextMsg = '';

        if ((m = MSG.exec(data)) !== null || (m = MSG.exec(this.pendingMsg + data)) !== null) {
          topic = m[1];
          sid = m[2];
          msg = substr_utf8_bytes(m.input, m[0].length, +m[5]);

          if (encode_utf8(msg).length !== +m[5]) {
            this.pendingMsg += data;
            return;
          }

          if (m.input === this.pendingMsg + data) {
            this.pendingMsg = '';
          }

          this._msgArrived(sid, msg); // 多个消息在一条


          nextMsg = m.input.substr(m[0].length + msg.length + CR_LF.length);
        } else if ((m = OK.exec(data)) !== null) {
          console.log(m);
          nextMsg = m.input.substr(m[0].length); // verbose ok
        } else if ((m = ERR.exec(data)) !== null) ; else if ((m = PONG.exec(data)) !== null) ; else if ((m = PING.exec(data)) !== null) {
          // PING, response PONG
          this.socket.send(PONG_RESPONSE);
        } else if ((m = INFO.exec(data)) !== null) ;

        if (nextMsg !== '') {
          this._onMessage.call(this, nextMsg);
        }
      }
    }, {
      key: "_onClose",
      value: function _onClose() {}
    }, {
      key: "_onError",
      value: function _onError() {}
    }, {
      key: "_msgArrived",
      value: function _msgArrived(sid, msg) {
        var callback = this.subMsgMap[sid] && this.subMsgMap[sid].callback;
        if (typeof callback === 'function') callback(msg);
      }
    }]);

    return Core;
  }();

  Core.Socket = null;

  Core.setSocket = function (Socket) {
    Core.Socket = Socket;
  };

  var Websocket =
  /*#__PURE__*/
  function () {
    function Websocket(_ref) {
      var url = _ref.url;

      _classCallCheck(this, Websocket);

      this.connected = false;
      this.url = url;
      this.onmessage = null;
      this.offmessage = null;
      this.onopen = null;
      this.offopen = null;
      this.onerror = null;
      this.offerror = null;
    }

    _createClass(Websocket, [{
      key: "connect",
      value: function connect() {}
    }, {
      key: "close",
      value: function close() {}
    }, {
      key: "send",
      value: function send() {}
    }]);

    return Websocket;
  }();

  function E() {// Keep this empty so it's easier to inherit from
    // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
  }

  E.prototype = {
    on: function on(name, callback, ctx) {
      var e = this.e || (this.e = {});
      (e[name] || (e[name] = [])).push({
        fn: callback,
        ctx: ctx
      });
      return this;
    },
    once: function once(name, callback, ctx) {
      var self = this;

      function listener() {
        self.off(name, listener);
        callback.apply(ctx, arguments);
      }
      listener._ = callback;
      return this.on(name, listener, ctx);
    },
    emit: function emit(name) {
      var data = [].slice.call(arguments, 1);
      var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
      var i = 0;
      var len = evtArr.length;

      for (i; i < len; i++) {
        evtArr[i].fn.apply(evtArr[i].ctx, data);
      }

      return this;
    },
    off: function off(name, callback) {
      var e = this.e || (this.e = {});
      var evts = e[name];
      var liveEvents = [];

      if (evts && callback) {
        for (var i = 0, len = evts.length; i < len; i++) {
          if (evts[i].fn !== callback && evts[i].fn._ !== callback) liveEvents.push(evts[i]);
        }
      } // Remove event from queue to prevent memory leak
      // Suggested by https://github.com/lazd
      // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910


      liveEvents.length ? e[name] = liveEvents : delete e[name];
      return this;
    }
  };

  var WxSocket =
  /*#__PURE__*/
  function (_Socket) {
    _inherits(WxSocket, _Socket);

    function WxSocket(opt) {
      var _this;

      _classCallCheck(this, WxSocket);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(WxSocket).call(this, opt));
      _this.socketTask = null;
      _this._eventEmitter = new E();
      return _this;
    }

    _createClass(WxSocket, [{
      key: "connect",
      value: function connect() {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          _this2.socketTask = wx.connectSocket({
            url: _this2.url,
            success: function success() {
              _this2._eventEmitter.once('open', resolve);
            },
            fail: function fail(err) {
              reject(err);
            }
          });

          _this2.socketTask.onOpen(_this2._onOpen.bind(_this2));

          _this2.socketTask.onMessage(_this2._onMessage.bind(_this2));

          _this2.socketTask.onClose(_this2._onClose.bind(_this2));

          _this2.socketTask.onError(_this2._onError.bind(_this2));
        });
      }
    }, {
      key: "_onOpen",
      value: function _onOpen(header) {
        this._eventEmitter.emit('open', header);
      }
    }, {
      key: "_onClose",
      value: function _onClose() {
        this._eventEmitter.emit('close');
      }
    }, {
      key: "_onMessage",
      value: function _onMessage(res) {
        var data = res.data;
        this.onmessage && this.onmessage(data);
      }
    }, {
      key: "_onError",
      value: function _onError() {}
    }, {
      key: "send",
      value: function send(msg) {
        this.socketTask.send({
          data: msg
        });
      }
    }]);

    return WxSocket;
  }(Websocket);

  Core.setSocket(WxSocket);

  return Core;

})));
