// Generated by CoffeeScript 1.7.1
(function() {
  var AVBuffer, EventEmitter, StreamSource,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = require('../../core/events');

  AVBuffer = require('../../core/buffer');

  StreamSource = (function(_super) {
    __extends(StreamSource, _super);

    function StreamSource(streamObj, size) {
      this.streamObj = streamObj;
      this.size = size;
      this.stream = null;
      this.loaded = 0;
    }

    StreamSource.prototype.getSize = function() {
      return this.size;
    };

    StreamSource.prototype.start = function() {
      var b, blen;
      if (this.stream) {
        return this.stream.resume();
      }
      this.stream = this.streamObj;
      b = new Buffer(1 << 20);
      blen = 0;
      this.stream.on('data', (function(_this) {
        return function(buf) {
          _this.loaded += buf.length;
          buf.copy(b, blen);
          blen = blen + buf.length;
          _this.emit('progress', _this.loaded / _this.size * 100);
          if (blen >= b.length || _this.loaded >= _this.size) {
            if (blen < b.length) {
              b = b.slice(0, blen);
            }
            _this.emit('data', new AVBuffer(new Uint8Array(b)));
            blen -= b.length;
            return buf.copy(b, 0, blen);
          }
        };
      })(this));
      this.stream.on('end', (function(_this) {
        return function() {
          return _this.emit('end');
        };
      })(this));
      return this.stream.on('error', (function(_this) {
        return function(err) {
          _this.pause();
          return _this.emit('error', err);
        };
      })(this));
    };

    StreamSource.prototype.pause = function() {
      return this.stream.pause();
    };

    return StreamSource;

  })(EventEmitter);

  module.exports = StreamSource;

}).call(this);