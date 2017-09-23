"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk = require("chalk");
const command_1 = require("@ionic/cli-utils/lib/command");
const serve_1 = require("@ionic/cli-utils/lib/serve");
let ServeCommand = class ServeCommand extends command_1.Command {
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { serve } = yield Promise.resolve().then(function () { return require('@ionic/cli-utils/commands/serve'); });
            const project = yield this.env.project.load();
            const serverDetails = yield serve(this.env, inputs, options);
            if (options['devapp']) {
                const port = serverDetails.port;
                const name = `${project.name}@${port}`;
                yield this.startDevApp(name, port);
                // this.env.log.info(`Published DevApp service (${chalk.bold(name)})`);
            }
            this.env.tasks.end();
        });
    }
    startDevApp(name, port) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { Publisher } = yield Promise.resolve().then(function () { return require('@ionic/discover'); });
            const service = new Publisher('devapp', name, port);
            service.path = '/?devapp=true';
            service.on('error', err => {
                // this.env.log.error(`Error in DevApp service: ${String(err.stack ? err.stack : err)}`);
            });
            try {
                yield service.start();
            }
            catch (e) {
                // this.env.log.error(`Could not publish DevApp service: ${String(e.stack ? e.stack : e)}`);
            }
        });
    }
};
ServeCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'serve',
        type: 'project',
        description: 'Start a local dev server for app dev/testing',
        longDescription: `
Easily spin up a development server which launches in your browser. It watches for changes in your source files and automatically reloads with the updated build.

By default, ${chalk.green('ionic serve')} boots up a development server on all network interfaces and prints the external address(es) on which your app is being served. To disable this, use ${chalk.green('--address=localhost')}.

Try the ${chalk.green('--lab')} option to see multiple platforms at once.
  `,
        exampleCommands: ['-c', '--lab -c'],
        options: [
            {
                name: 'consolelogs',
                description: 'Print app console logs to Ionic CLI',
                type: Boolean,
                aliases: ['c'],
            },
            {
                name: 'serverlogs',
                description: 'Print dev server logs to Ionic CLI',
                type: Boolean,
                aliases: ['s'],
                visible: false,
            },
            {
                name: 'address',
                description: 'Use specific address for the dev server',
                default: serve_1.BIND_ALL_ADDRESS,
                advanced: true,
            },
            {
                name: 'port',
                description: 'Use specific port for HTTP',
                default: String(serve_1.DEFAULT_SERVER_PORT),
                aliases: ['p'],
                advanced: true,
            },
            {
                name: 'livereload-port',
                description: 'Use specific port for live-reload',
                default: String(serve_1.DEFAULT_LIVERELOAD_PORT),
                aliases: ['r'],
                advanced: true,
            },
            {
                name: 'dev-logger-port',
                description: 'Use specific port for dev server communication',
                default: String(serve_1.DEFAULT_DEV_LOGGER_PORT),
                advanced: true,
            },
            {
                name: 'nobrowser',
                description: 'Disable launching a browser',
                type: Boolean,
                aliases: ['b'],
            },
            {
                name: 'noproxy',
                description: 'Do not add proxies',
                type: Boolean,
                aliases: ['x'],
                advanced: true,
            },
            {
                name: 'browser',
                description: `Specifies the browser to use (${serve_1.BROWSERS.map(b => chalk.green(b)).join(', ')})`,
                aliases: ['w'],
                advanced: true,
            },
            {
                name: 'browseroption',
                description: `Specifies a path to open to (${chalk.green('/#/tab/dash')})`,
                aliases: ['o'],
                advanced: true,
            },
            {
                name: 'lab',
                description: 'Test your apps on multiple platform types in the browser',
                type: Boolean,
                aliases: ['l'],
            },
            {
                name: 'platform',
                description: `Start serve with a specific platform (${['android', 'ios'].map(t => chalk.green(t)).join(', ')})`,
                aliases: ['t'],
            },
            {
                name: 'auth',
                description: 'HTTP Basic Auth password to secure the server on your local network',
                type: String,
                visible: false,
            },
            {
                name: 'devapp',
                description: 'Do not publish devapp service',
                type: Boolean,
                default: true,
                advanced: true,
                visible: false,
            },
        ],
    })
], ServeCommand);
exports.ServeCommand = ServeCommand;
