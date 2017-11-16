"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const namespace_1 = require("@ionic/cli-utils/lib/namespace");
const errors_1 = require("@ionic/cli-utils/lib/errors");
class IonicNamespace extends namespace_1.Namespace {
    constructor() {
        super(...arguments);
        this.root = true;
        this.name = 'ionic';
        this.description = '';
        this.longDescription = '';
        this.namespaces = new namespace_1.NamespaceMap([
            ['config', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { ConfigNamespace } = yield Promise.resolve().then(() => require('./config/index')); return new ConfigNamespace(); })],
            ['cordova', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { CordovaNamespace } = yield Promise.resolve().then(() => require('./cordova/index')); return new CordovaNamespace(); })],
            ['git', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { GitNamespace } = yield Promise.resolve().then(() => require('./git/index')); return new GitNamespace(); })],
            ['ssh', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { SSHNamespace } = yield Promise.resolve().then(() => require('./ssh/index')); return new SSHNamespace(); })],
            ['package', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { PackageNamespace } = yield Promise.resolve().then(() => require('./package/index')); return new PackageNamespace(); })],
            ['monitoring', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { MonitoringNamespace } = yield Promise.resolve().then(() => require('./monitoring/index')); return new MonitoringNamespace(); })],
            ['doctor', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { DoctorNamespace } = yield Promise.resolve().then(() => require('./doctor/index')); return new DoctorNamespace(); })],
            ['integrations', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { IntegrationsNamespace } = yield Promise.resolve().then(() => require('./integrations/index')); return new IntegrationsNamespace(); })],
        ]);
        this.commands = new namespace_1.CommandMap([
            ['start', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { StartCommand } = yield Promise.resolve().then(() => require('./start')); return new StartCommand(); })],
            ['serve', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { ServeCommand } = yield Promise.resolve().then(() => require('./serve')); return new ServeCommand(); })],
            ['build', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { BuildCommand } = yield Promise.resolve().then(() => require('./build')); return new BuildCommand(); })],
            ['help', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { HelpCommand } = yield Promise.resolve().then(() => require('./help')); return new HelpCommand(); })],
            ['info', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { InfoCommand } = yield Promise.resolve().then(() => require('./info')); return new InfoCommand(); })],
            ['login', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { LoginCommand } = yield Promise.resolve().then(() => require('./login')); return new LoginCommand(); })],
            ['logout', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { LogoutCommand } = yield Promise.resolve().then(() => require('./logout')); return new LogoutCommand(); })],
            ['signup', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { SignupCommand } = yield Promise.resolve().then(() => require('./signup')); return new SignupCommand(); })],
            ['version', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { VersionCommand } = yield Promise.resolve().then(() => require('./version')); return new VersionCommand(); })],
            ['telemetry', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { TelemetryCommand } = yield Promise.resolve().then(() => require('./telemetry')); return new TelemetryCommand(); })],
            ['docs', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { DocsCommand } = yield Promise.resolve().then(() => require('./docs')); return new DocsCommand(); })],
            ['daemon', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { DaemonCommand } = yield Promise.resolve().then(() => require('./daemon')); return new DaemonCommand(); })],
            ['ionitron', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { IonitronCommand } = yield Promise.resolve().then(() => require('./ionitron')); return new IonitronCommand(); })],
            ['generate', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { GenerateCommand } = yield Promise.resolve().then(() => require('./generate')); return new GenerateCommand(); })],
            ['g', 'generate'],
            ['link', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { LinkCommand } = yield Promise.resolve().then(() => require('./link')); return new LinkCommand(); })],
            ['upload', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { UploadCommand } = yield Promise.resolve().then(() => require('./upload')); return new UploadCommand(); })],
            ['state', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { StateCommand } = yield Promise.resolve().then(() => require('./state')); return new StateCommand(); })],
            ['share', () => tslib_1.__awaiter(this, void 0, void 0, function* () { const { ShareCommand } = yield Promise.resolve().then(() => require('./share')); return new ShareCommand(); })],
        ]);
    }
    runCommand(env, pargv) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { metadataToMinimistOptions } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/utils/command'));
            const { parseArgs } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/init'));
            const { isCommand } = yield Promise.resolve().then(() => require('@ionic/cli-utils/guards'));
            const config = yield env.config.load();
            const argv = parseArgs(pargv, { boolean: true, string: '_' });
            let [depth, inputs, cmdOrNamespace] = yield this.locate(argv._);
            if (!isCommand(cmdOrNamespace)) {
                const { showHelp } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/help'));
                yield env.telemetry.sendCommand('ionic help', argv._);
                return showHelp(env, argv._);
            }
            const command = cmdOrNamespace;
            const minimistOpts = metadataToMinimistOptions(command.metadata);
            if (command.metadata.backends && !command.metadata.backends.includes(config.backend)) {
                throw new errors_1.FatalException(`Sorry! The configured backend (${chalk_1.default.bold(config.backend)}) does not know about ${chalk_1.default.green('ionic ' + command.metadata.fullName)}.\n` +
                    `You can switch backends with ${chalk_1.default.green('ionic config set -g backend')} (choose from ${cli_utils_1.KNOWN_BACKENDS.map(v => chalk_1.default.green(v)).join(', ')}).\n`);
            }
            const options = parseArgs(pargv, minimistOpts);
            inputs = options._.slice(depth);
            command.env = env;
            yield command.validate(inputs);
            if (!env.project.directory && command.metadata.type === 'project') {
                throw new errors_1.FatalException(`Sorry! ${chalk_1.default.green('ionic ' + command.metadata.fullName)} can only be run in an Ionic project directory.`);
            }
            if (command.metadata.options) {
                let found = false;
                for (let opt of command.metadata.options) {
                    if (opt.backends && opt.default !== options[opt.name] && !opt.backends.includes(config.backend)) {
                        found = true;
                        env.log.warn(`${chalk_1.default.green('--' + (opt.default === true ? 'no-' : '') + opt.name)} has no effect with the configured backend (${chalk_1.default.bold(config.backend)}).`);
                    }
                }
                if (found) {
                    env.log.info(`You can switch backends with ${chalk_1.default.green('ionic config set -g backend')}.`);
                }
            }
            yield command.execute(inputs, options);
        });
    }
}
exports.IonicNamespace = IonicNamespace;
