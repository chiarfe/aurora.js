// Generated by CoffeeScript 1.7.1
(function() {
  var Filter, VolumeFilter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Filter = require('../filter');

  VolumeFilter = (function(_super) {
    __extends(VolumeFilter, _super);

    function VolumeFilter() {
      return VolumeFilter.__super__.constructor.apply(this, arguments);
    }

    VolumeFilter.prototype.process = function(buffer) {
      var i, vol, _i, _ref;
      if (this.value >= 100) {
        return;
      }
      vol = Math.max(0, Math.min(100, this.value)) / 100;
      for (i = _i = 0, _ref = buffer.length; _i < _ref; i = _i += 1) {
        buffer[i] *= vol;
      }
    };

    return VolumeFilter;

  })(Filter);

  module.exports = VolumeFilter;

}).call(this);