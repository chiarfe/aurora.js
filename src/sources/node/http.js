// Generated by CoffeeScript 1.7.1
(function() {
  var AVBuffer, EventEmitter, HTTPSource, http,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = require('../../core/events');

  AVBuffer = require('../../core/buffer');

  http = require('http');

  HTTPSource = (function(_super) {
    __extends(HTTPSource, _super);

    function HTTPSource(url) {
      this.url = url;
      this.errorHandler = __bind(this.errorHandler, this);
      this.request = null;
      this.response = null;
      this.loaded = 0;
      this.size = 0;
    }

    HTTPSource.prototype.start = function() {
      if (this.response != null) {
        return this.response.resume();
      }
      this.request = http.get(this.url);
      this.request.on('response', (function(_this) {
        return function(response) {
          _this.response = response;
          if (_this.response.statusCode !== 200) {
            return _this.errorHandler('Error loading file. HTTP status code ' + _this.response.statusCode);
          }
          _this.size = parseInt(_this.response.headers['content-length']);
          _this.loaded = 0;
          _this.response.on('data', function(chunk) {
            _this.loaded += chunk.length;
            _this.emit('progress', _this.loaded / _this.size * 100);
            return _this.emit('data', new AVBuffer(new Uint8Array(chunk)));
          });
          _this.response.on('end', function() {
            return _this.emit('end');
          });
          return _this.response.on('error', _this.errorHandler);
        };
      })(this));
      return this.request.on('error', this.errorHandler);
    };

    HTTPSource.prototype.pause = function() {
      var _ref;
      return (_ref = this.response) != null ? _ref.pause() : void 0;
    };

    HTTPSource.prototype.reset = function() {
      this.pause();
      this.request.abort();
      this.request = null;
      return this.response = null;
    };

    HTTPSource.prototype.errorHandler = function(err) {
      this.reset();
      return this.emit('error', err);
    };

    return HTTPSource;

  })(EventEmitter);

  module.exports = HTTPSource;

}).call(this);
