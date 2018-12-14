'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _slave = require('./slave');

var _slave2 = _interopRequireDefault(_slave);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _bluebird.coroutine)(function* () {
    var slave = new _slave2.default({
      sendMessage: function sendMessage(m) {
        return process.send(m);
      },
      cwd: process.cwd(),
      exit: function exit() {
        return process.exit();
      }
    });
    process.on('message', function (m) {
      return slave.receiveMessage(m);
    });
  });

  function run() {
    return _ref.apply(this, arguments);
  }

  return run;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ydW50aW1lL3BhcmFsbGVsL3J1bl9zbGF2ZS5qcyJdLCJuYW1lcyI6WyJzbGF2ZSIsInNlbmRNZXNzYWdlIiwicHJvY2VzcyIsInNlbmQiLCJtIiwiY3dkIiwiZXhpdCIsIm9uIiwicmVjZWl2ZU1lc3NhZ2UiLCJydW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7c0NBRWUsYUFBcUI7QUFDbEMsUUFBTUEsUUFBUSxvQkFBVTtBQUN0QkMsbUJBQWE7QUFBQSxlQUFLQyxRQUFRQyxJQUFSLENBQWFDLENBQWIsQ0FBTDtBQUFBLE9BRFM7QUFFdEJDLFdBQUtILFFBQVFHLEdBQVIsRUFGaUI7QUFHdEJDLFlBQU07QUFBQSxlQUFNSixRQUFRSSxJQUFSLEVBQU47QUFBQTtBQUhnQixLQUFWLENBQWQ7QUFLQUosWUFBUUssRUFBUixDQUFXLFNBQVgsRUFBc0I7QUFBQSxhQUFLUCxNQUFNUSxjQUFOLENBQXFCSixDQUFyQixDQUFMO0FBQUEsS0FBdEI7QUFDRCxHOztXQVA2QkssRzs7OztTQUFBQSxHIiwiZmlsZSI6InJ1bl9zbGF2ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTbGF2ZSBmcm9tICcuL3NsYXZlJ1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBydW4oKSB7XG4gIGNvbnN0IHNsYXZlID0gbmV3IFNsYXZlKHtcbiAgICBzZW5kTWVzc2FnZTogbSA9PiBwcm9jZXNzLnNlbmQobSksXG4gICAgY3dkOiBwcm9jZXNzLmN3ZCgpLFxuICAgIGV4aXQ6ICgpID0+IHByb2Nlc3MuZXhpdCgpLFxuICB9KVxuICBwcm9jZXNzLm9uKCdtZXNzYWdlJywgbSA9PiBzbGF2ZS5yZWNlaXZlTWVzc2FnZShtKSlcbn1cbiJdfQ==