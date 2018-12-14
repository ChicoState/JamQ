'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _helpers = require('../formatter/helpers');

var _helpers2 = require('./helpers');

var _install_validator = require('./install_validator');

var _i18n = require('./i18n');

var I18n = _interopRequireWildcard(_i18n);

var _configuration_builder = require('./configuration_builder');

var _configuration_builder2 = _interopRequireDefault(_configuration_builder);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _builder = require('../formatter/builder');

var _builder2 = _interopRequireDefault(_builder);

var _fs = require('mz/fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pickle_filter = require('../pickle_filter');

var _pickle_filter2 = _interopRequireDefault(_pickle_filter);

var _master = require('../runtime/parallel/master');

var _master2 = _interopRequireDefault(_master);

var _runtime = require('../runtime');

var _runtime2 = _interopRequireDefault(_runtime);

var _support_code_library_builder = require('../support_code_library_builder');

var _support_code_library_builder2 = _interopRequireDefault(_support_code_library_builder);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Cli = function () {
  function Cli(_ref) {
    var argv = _ref.argv,
        cwd = _ref.cwd,
        stdout = _ref.stdout;
    (0, _classCallCheck3.default)(this, Cli);

    this.argv = argv;
    this.cwd = cwd;
    this.stdout = stdout;
  }

  (0, _createClass3.default)(Cli, [{
    key: 'getConfiguration',
    value: function () {
      var _ref2 = (0, _bluebird.coroutine)(function* () {
        var fullArgv = yield (0, _helpers2.getExpandedArgv)({ argv: this.argv, cwd: this.cwd });
        return _configuration_builder2.default.build({ argv: fullArgv, cwd: this.cwd });
      });

      function getConfiguration() {
        return _ref2.apply(this, arguments);
      }

      return getConfiguration;
    }()
  }, {
    key: 'initializeFormatters',
    value: function () {
      var _ref4 = (0, _bluebird.coroutine)(function* (_ref3) {
        var _this = this;

        var eventBroadcaster = _ref3.eventBroadcaster,
            formatOptions = _ref3.formatOptions,
            formats = _ref3.formats,
            supportCodeLibrary = _ref3.supportCodeLibrary;

        var streamsToClose = [];
        var eventDataCollector = new _helpers.EventDataCollector(eventBroadcaster);
        yield _bluebird2.default.map(formats, function () {
          var _ref6 = (0, _bluebird.coroutine)(function* (_ref5) {
            var _context;

            var type = _ref5.type,
                outputTo = _ref5.outputTo;

            var stream = _this.stdout;
            if (outputTo) {
              var fd = yield _fs2.default.open(_path2.default.resolve(_this.cwd, outputTo), 'w');
              stream = _fs2.default.createWriteStream(null, { fd: fd });
              streamsToClose.push(stream);
            }
            var typeOptions = (0, _extends3.default)({
              eventBroadcaster: eventBroadcaster,
              eventDataCollector: eventDataCollector,
              log: (_context = stream).write.bind(_context),
              stream: stream,
              supportCodeLibrary: supportCodeLibrary
            }, formatOptions);
            if (!formatOptions.hasOwnProperty('colorsEnabled')) {
              typeOptions.colorsEnabled = !!stream.isTTY;
            }
            if (type === 'progress-bar' && !stream.isTTY) {
              console.warn('Cannot use \'progress-bar\' formatter for output to \'' + (outputTo || 'stdout') + '\' as not a TTY. Switching to \'progress\' formatter.');
              type = 'progress';
            }
            return _builder2.default.build(type, typeOptions);
          });

          return function (_x2) {
            return _ref6.apply(this, arguments);
          };
        }());
        return function () {
          return _bluebird2.default.each(streamsToClose, function (stream) {
            return _bluebird2.default.promisify(stream.end.bind(stream))();
          });
        };
      });

      function initializeFormatters(_x) {
        return _ref4.apply(this, arguments);
      }

      return initializeFormatters;
    }()
  }, {
    key: 'getSupportCodeLibrary',
    value: function getSupportCodeLibrary(_ref7) {
      var supportCodeRequiredModules = _ref7.supportCodeRequiredModules,
          supportCodePaths = _ref7.supportCodePaths;

      supportCodeRequiredModules.map(function (module) {
        return require(module);
      });
      _support_code_library_builder2.default.reset(this.cwd);
      supportCodePaths.forEach(function (codePath) {
        return require(codePath);
      });
      return _support_code_library_builder2.default.finalize();
    }
  }, {
    key: 'run',
    value: function () {
      var _ref8 = (0, _bluebird.coroutine)(function* () {
        yield (0, _install_validator.validateInstall)(this.cwd);
        var configuration = yield this.getConfiguration();
        if (configuration.listI18nLanguages) {
          this.stdout.write(I18n.getLanguages());
          return { success: true };
        }
        if (configuration.listI18nKeywordsFor) {
          this.stdout.write(I18n.getKeywords(configuration.listI18nKeywordsFor));
          return { success: true };
        }
        var supportCodeLibrary = this.getSupportCodeLibrary(configuration);
        var eventBroadcaster = new _events2.default();
        var cleanup = yield this.initializeFormatters({
          eventBroadcaster: eventBroadcaster,
          formatOptions: configuration.formatOptions,
          formats: configuration.formats,
          supportCodeLibrary: supportCodeLibrary
        });
        var testCases = yield (0, _helpers2.getTestCasesFromFilesystem)({
          cwd: this.cwd,
          eventBroadcaster: eventBroadcaster,
          featureDefaultLanguage: configuration.featureDefaultLanguage,
          featurePaths: configuration.featurePaths,
          order: configuration.order,
          pickleFilter: new _pickle_filter2.default(configuration.pickleFilterOptions)
        });
        var success = void 0;
        if (configuration.parallel) {
          var parallelRuntimeMaster = new _master2.default({
            eventBroadcaster: eventBroadcaster,
            options: configuration.runtimeOptions,
            supportCodePaths: configuration.supportCodePaths,
            supportCodeRequiredModules: configuration.supportCodeRequiredModules,
            testCases: testCases
          });
          yield new _bluebird2.default(function (resolve) {
            parallelRuntimeMaster.run(configuration.parallel, function (s) {
              success = s;
              resolve();
            });
          });
        } else {
          var runtime = new _runtime2.default({
            eventBroadcaster: eventBroadcaster,
            options: configuration.runtimeOptions,
            supportCodeLibrary: supportCodeLibrary,
            testCases: testCases
          });
          success = yield runtime.start();
        }
        yield cleanup();
        return {
          shouldExitImmediately: configuration.shouldExitImmediately,
          success: success
        };
      });

      function run() {
        return _ref8.apply(this, arguments);
      }

      return run;
    }()
  }]);
  return Cli;
}();

exports.default = Cli;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvaW5kZXguanMiXSwibmFtZXMiOlsiSTE4biIsIkNsaSIsImFyZ3YiLCJjd2QiLCJzdGRvdXQiLCJmdWxsQXJndiIsImJ1aWxkIiwiZXZlbnRCcm9hZGNhc3RlciIsImZvcm1hdE9wdGlvbnMiLCJmb3JtYXRzIiwic3VwcG9ydENvZGVMaWJyYXJ5Iiwic3RyZWFtc1RvQ2xvc2UiLCJldmVudERhdGFDb2xsZWN0b3IiLCJtYXAiLCJ0eXBlIiwib3V0cHV0VG8iLCJzdHJlYW0iLCJmZCIsIm9wZW4iLCJyZXNvbHZlIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJwdXNoIiwidHlwZU9wdGlvbnMiLCJsb2ciLCJ3cml0ZSIsImhhc093blByb3BlcnR5IiwiY29sb3JzRW5hYmxlZCIsImlzVFRZIiwiY29uc29sZSIsIndhcm4iLCJlYWNoIiwicHJvbWlzaWZ5IiwiZW5kIiwic3VwcG9ydENvZGVSZXF1aXJlZE1vZHVsZXMiLCJzdXBwb3J0Q29kZVBhdGhzIiwicmVxdWlyZSIsIm1vZHVsZSIsInJlc2V0IiwiZm9yRWFjaCIsImNvZGVQYXRoIiwiZmluYWxpemUiLCJjb25maWd1cmF0aW9uIiwiZ2V0Q29uZmlndXJhdGlvbiIsImxpc3RJMThuTGFuZ3VhZ2VzIiwiZ2V0TGFuZ3VhZ2VzIiwic3VjY2VzcyIsImxpc3RJMThuS2V5d29yZHNGb3IiLCJnZXRLZXl3b3JkcyIsImdldFN1cHBvcnRDb2RlTGlicmFyeSIsImNsZWFudXAiLCJpbml0aWFsaXplRm9ybWF0dGVycyIsInRlc3RDYXNlcyIsImZlYXR1cmVEZWZhdWx0TGFuZ3VhZ2UiLCJmZWF0dXJlUGF0aHMiLCJvcmRlciIsInBpY2tsZUZpbHRlciIsInBpY2tsZUZpbHRlck9wdGlvbnMiLCJwYXJhbGxlbCIsInBhcmFsbGVsUnVudGltZU1hc3RlciIsIm9wdGlvbnMiLCJydW50aW1lT3B0aW9ucyIsInJ1biIsInMiLCJydW50aW1lIiwic3RhcnQiLCJzaG91bGRFeGl0SW1tZWRpYXRlbHki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ZSxtQkFBL0I7QUFObUMsU0FBM0IsQ0FBeEI7QUFRQSxZQUFJWCxnQkFBSjtBQUNBLFlBQUlKLGNBQWNnQixRQUFsQixFQUE0QjtBQUMxQixjQUFNQyx3QkFBd0IscUJBQTBCO0FBQ3REbkQsOENBRHNEO0FBRXREb0QscUJBQVNsQixjQUFjbUIsY0FGK0I7QUFHdEQxQiw4QkFBa0JPLGNBQWNQLGdCQUhzQjtBQUl0REQsd0NBQTRCUSxjQUFjUiwwQkFKWTtBQUt0RGtCO0FBTHNELFdBQTFCLENBQTlCO0FBT0EsZ0JBQU0sdUJBQVksbUJBQVc7QUFDM0JPLGtDQUFzQkcsR0FBdEIsQ0FBMEJwQixjQUFjZ0IsUUFBeEMsRUFBa0QsYUFBSztBQUNyRFosd0JBQVVpQixDQUFWO0FBQ0EzQztBQUNELGFBSEQ7QUFJRCxXQUxLLENBQU47QUFNRCxTQWRELE1BY087QUFDTCxjQUFNNEMsVUFBVSxzQkFBWTtBQUMxQnhELDhDQUQwQjtBQUUxQm9ELHFCQUFTbEIsY0FBY21CLGNBRkc7QUFHMUJsRCxrREFIMEI7QUFJMUJ5QztBQUowQixXQUFaLENBQWhCO0FBTUFOLG9CQUFVLE1BQU1rQixRQUFRQyxLQUFSLEVBQWhCO0FBQ0Q7QUFDRCxjQUFNZixTQUFOO0FBQ0EsZUFBTztBQUNMZ0IsaUNBQXVCeEIsY0FBY3dCLHFCQURoQztBQUVMcEI7QUFGSyxTQUFQO0FBSUQsTzs7Ozs7Ozs7Ozs7O2tCQXJIa0I1QyxHIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnREYXRhQ29sbGVjdG9yIH0gZnJvbSAnLi4vZm9ybWF0dGVyL2hlbHBlcnMnXG5pbXBvcnQgeyBnZXRFeHBhbmRlZEFyZ3YsIGdldFRlc3RDYXNlc0Zyb21GaWxlc3lzdGVtIH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHsgdmFsaWRhdGVJbnN0YWxsIH0gZnJvbSAnLi9pbnN0YWxsX3ZhbGlkYXRvcidcbmltcG9ydCAqIGFzIEkxOG4gZnJvbSAnLi9pMThuJ1xuaW1wb3J0IENvbmZpZ3VyYXRpb25CdWlsZGVyIGZyb20gJy4vY29uZmlndXJhdGlvbl9idWlsZGVyJ1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnXG5pbXBvcnQgRm9ybWF0dGVyQnVpbGRlciBmcm9tICcuLi9mb3JtYXR0ZXIvYnVpbGRlcidcbmltcG9ydCBmcyBmcm9tICdtei9mcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgUGlja2xlRmlsdGVyIGZyb20gJy4uL3BpY2tsZV9maWx0ZXInXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCdcbmltcG9ydCBQYXJhbGxlbFJ1bnRpbWVNYXN0ZXIgZnJvbSAnLi4vcnVudGltZS9wYXJhbGxlbC9tYXN0ZXInXG5pbXBvcnQgUnVudGltZSBmcm9tICcuLi9ydW50aW1lJ1xuaW1wb3J0IHN1cHBvcnRDb2RlTGlicmFyeUJ1aWxkZXIgZnJvbSAnLi4vc3VwcG9ydF9jb2RlX2xpYnJhcnlfYnVpbGRlcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpIHtcbiAgY29uc3RydWN0b3IoeyBhcmd2LCBjd2QsIHN0ZG91dCB9KSB7XG4gICAgdGhpcy5hcmd2ID0gYXJndlxuICAgIHRoaXMuY3dkID0gY3dkXG4gICAgdGhpcy5zdGRvdXQgPSBzdGRvdXRcbiAgfVxuXG4gIGFzeW5jIGdldENvbmZpZ3VyYXRpb24oKSB7XG4gICAgY29uc3QgZnVsbEFyZ3YgPSBhd2FpdCBnZXRFeHBhbmRlZEFyZ3YoeyBhcmd2OiB0aGlzLmFyZ3YsIGN3ZDogdGhpcy5jd2QgfSlcbiAgICByZXR1cm4gQ29uZmlndXJhdGlvbkJ1aWxkZXIuYnVpbGQoeyBhcmd2OiBmdWxsQXJndiwgY3dkOiB0aGlzLmN3ZCB9KVxuICB9XG5cbiAgYXN5bmMgaW5pdGlhbGl6ZUZvcm1hdHRlcnMoe1xuICAgIGV2ZW50QnJvYWRjYXN0ZXIsXG4gICAgZm9ybWF0T3B0aW9ucyxcbiAgICBmb3JtYXRzLFxuICAgIHN1cHBvcnRDb2RlTGlicmFyeSxcbiAgfSkge1xuICAgIGNvbnN0IHN0cmVhbXNUb0Nsb3NlID0gW11cbiAgICBjb25zdCBldmVudERhdGFDb2xsZWN0b3IgPSBuZXcgRXZlbnREYXRhQ29sbGVjdG9yKGV2ZW50QnJvYWRjYXN0ZXIpXG4gICAgYXdhaXQgUHJvbWlzZS5tYXAoZm9ybWF0cywgYXN5bmMgKHsgdHlwZSwgb3V0cHV0VG8gfSkgPT4ge1xuICAgICAgbGV0IHN0cmVhbSA9IHRoaXMuc3Rkb3V0XG4gICAgICBpZiAob3V0cHV0VG8pIHtcbiAgICAgICAgY29uc3QgZmQgPSBhd2FpdCBmcy5vcGVuKHBhdGgucmVzb2x2ZSh0aGlzLmN3ZCwgb3V0cHV0VG8pLCAndycpXG4gICAgICAgIHN0cmVhbSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKG51bGwsIHsgZmQgfSlcbiAgICAgICAgc3RyZWFtc1RvQ2xvc2UucHVzaChzdHJlYW0pXG4gICAgICB9XG4gICAgICBjb25zdCB0eXBlT3B0aW9ucyA9IHtcbiAgICAgICAgZXZlbnRCcm9hZGNhc3RlcixcbiAgICAgICAgZXZlbnREYXRhQ29sbGVjdG9yLFxuICAgICAgICBsb2c6IDo6c3RyZWFtLndyaXRlLFxuICAgICAgICBzdHJlYW0sXG4gICAgICAgIHN1cHBvcnRDb2RlTGlicmFyeSxcbiAgICAgICAgLi4uZm9ybWF0T3B0aW9ucyxcbiAgICAgIH1cbiAgICAgIGlmICghZm9ybWF0T3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnY29sb3JzRW5hYmxlZCcpKSB7XG4gICAgICAgIHR5cGVPcHRpb25zLmNvbG9yc0VuYWJsZWQgPSAhIXN0cmVhbS5pc1RUWVxuICAgICAgfVxuICAgICAgaWYgKHR5cGUgPT09ICdwcm9ncmVzcy1iYXInICYmICFzdHJlYW0uaXNUVFkpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgIGBDYW5ub3QgdXNlICdwcm9ncmVzcy1iYXInIGZvcm1hdHRlciBmb3Igb3V0cHV0IHRvICcke291dHB1dFRvIHx8XG4gICAgICAgICAgICAnc3Rkb3V0J30nIGFzIG5vdCBhIFRUWS4gU3dpdGNoaW5nIHRvICdwcm9ncmVzcycgZm9ybWF0dGVyLmBcbiAgICAgICAgKVxuICAgICAgICB0eXBlID0gJ3Byb2dyZXNzJ1xuICAgICAgfVxuICAgICAgcmV0dXJuIEZvcm1hdHRlckJ1aWxkZXIuYnVpbGQodHlwZSwgdHlwZU9wdGlvbnMpXG4gICAgfSlcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5lYWNoKHN0cmVhbXNUb0Nsb3NlLCBzdHJlYW0gPT5cbiAgICAgICAgUHJvbWlzZS5wcm9taXNpZnkoOjpzdHJlYW0uZW5kKSgpXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgZ2V0U3VwcG9ydENvZGVMaWJyYXJ5KHsgc3VwcG9ydENvZGVSZXF1aXJlZE1vZHVsZXMsIHN1cHBvcnRDb2RlUGF0aHMgfSkge1xuICAgIHN1cHBvcnRDb2RlUmVxdWlyZWRNb2R1bGVzLm1hcChtb2R1bGUgPT4gcmVxdWlyZShtb2R1bGUpKVxuICAgIHN1cHBvcnRDb2RlTGlicmFyeUJ1aWxkZXIucmVzZXQodGhpcy5jd2QpXG4gICAgc3VwcG9ydENvZGVQYXRocy5mb3JFYWNoKGNvZGVQYXRoID0+IHJlcXVpcmUoY29kZVBhdGgpKVxuICAgIHJldHVybiBzdXBwb3J0Q29kZUxpYnJhcnlCdWlsZGVyLmZpbmFsaXplKClcbiAgfVxuXG4gIGFzeW5jIHJ1bigpIHtcbiAgICBhd2FpdCB2YWxpZGF0ZUluc3RhbGwodGhpcy5jd2QpXG4gICAgY29uc3QgY29uZmlndXJhdGlvbiA9IGF3YWl0IHRoaXMuZ2V0Q29uZmlndXJhdGlvbigpXG4gICAgaWYgKGNvbmZpZ3VyYXRpb24ubGlzdEkxOG5MYW5ndWFnZXMpIHtcbiAgICAgIHRoaXMuc3Rkb3V0LndyaXRlKEkxOG4uZ2V0TGFuZ3VhZ2VzKCkpXG4gICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH1cbiAgICB9XG4gICAgaWYgKGNvbmZpZ3VyYXRpb24ubGlzdEkxOG5LZXl3b3Jkc0Zvcikge1xuICAgICAgdGhpcy5zdGRvdXQud3JpdGUoSTE4bi5nZXRLZXl3b3Jkcyhjb25maWd1cmF0aW9uLmxpc3RJMThuS2V5d29yZHNGb3IpKVxuICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XG4gICAgfVxuICAgIGNvbnN0IHN1cHBvcnRDb2RlTGlicmFyeSA9IHRoaXMuZ2V0U3VwcG9ydENvZGVMaWJyYXJ5KGNvbmZpZ3VyYXRpb24pXG4gICAgY29uc3QgZXZlbnRCcm9hZGNhc3RlciA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuICAgIGNvbnN0IGNsZWFudXAgPSBhd2FpdCB0aGlzLmluaXRpYWxpemVGb3JtYXR0ZXJzKHtcbiAgICAgIGV2ZW50QnJvYWRjYXN0ZXIsXG4gICAgICBmb3JtYXRPcHRpb25zOiBjb25maWd1cmF0aW9uLmZvcm1hdE9wdGlvbnMsXG4gICAgICBmb3JtYXRzOiBjb25maWd1cmF0aW9uLmZvcm1hdHMsXG4gICAgICBzdXBwb3J0Q29kZUxpYnJhcnksXG4gICAgfSlcbiAgICBjb25zdCB0ZXN0Q2FzZXMgPSBhd2FpdCBnZXRUZXN0Q2FzZXNGcm9tRmlsZXN5c3RlbSh7XG4gICAgICBjd2Q6IHRoaXMuY3dkLFxuICAgICAgZXZlbnRCcm9hZGNhc3RlcixcbiAgICAgIGZlYXR1cmVEZWZhdWx0TGFuZ3VhZ2U6IGNvbmZpZ3VyYXRpb24uZmVhdHVyZURlZmF1bHRMYW5ndWFnZSxcbiAgICAgIGZlYXR1cmVQYXRoczogY29uZmlndXJhdGlvbi5mZWF0dXJlUGF0aHMsXG4gICAgICBvcmRlcjogY29uZmlndXJhdGlvbi5vcmRlcixcbiAgICAgIHBpY2tsZUZpbHRlcjogbmV3IFBpY2tsZUZpbHRlcihjb25maWd1cmF0aW9uLnBpY2tsZUZpbHRlck9wdGlvbnMpLFxuICAgIH0pXG4gICAgbGV0IHN1Y2Nlc3NcbiAgICBpZiAoY29uZmlndXJhdGlvbi5wYXJhbGxlbCkge1xuICAgICAgY29uc3QgcGFyYWxsZWxSdW50aW1lTWFzdGVyID0gbmV3IFBhcmFsbGVsUnVudGltZU1hc3Rlcih7XG4gICAgICAgIGV2ZW50QnJvYWRjYXN0ZXIsXG4gICAgICAgIG9wdGlvbnM6IGNvbmZpZ3VyYXRpb24ucnVudGltZU9wdGlvbnMsXG4gICAgICAgIHN1cHBvcnRDb2RlUGF0aHM6IGNvbmZpZ3VyYXRpb24uc3VwcG9ydENvZGVQYXRocyxcbiAgICAgICAgc3VwcG9ydENvZGVSZXF1aXJlZE1vZHVsZXM6IGNvbmZpZ3VyYXRpb24uc3VwcG9ydENvZGVSZXF1aXJlZE1vZHVsZXMsXG4gICAgICAgIHRlc3RDYXNlcyxcbiAgICAgIH0pXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgcGFyYWxsZWxSdW50aW1lTWFzdGVyLnJ1bihjb25maWd1cmF0aW9uLnBhcmFsbGVsLCBzID0+IHtcbiAgICAgICAgICBzdWNjZXNzID0gc1xuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcnVudGltZSA9IG5ldyBSdW50aW1lKHtcbiAgICAgICAgZXZlbnRCcm9hZGNhc3RlcixcbiAgICAgICAgb3B0aW9uczogY29uZmlndXJhdGlvbi5ydW50aW1lT3B0aW9ucyxcbiAgICAgICAgc3VwcG9ydENvZGVMaWJyYXJ5LFxuICAgICAgICB0ZXN0Q2FzZXMsXG4gICAgICB9KVxuICAgICAgc3VjY2VzcyA9IGF3YWl0IHJ1bnRpbWUuc3RhcnQoKVxuICAgIH1cbiAgICBhd2FpdCBjbGVhbnVwKClcbiAgICByZXR1cm4ge1xuICAgICAgc2hvdWxkRXhpdEltbWVkaWF0ZWx5OiBjb25maWd1cmF0aW9uLnNob3VsZEV4aXRJbW1lZGlhdGVseSxcbiAgICAgIHN1Y2Nlc3MsXG4gICAgfVxuICB9XG59XG4iXX0=