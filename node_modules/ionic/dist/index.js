"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const util = require("util");
const chalk_1 = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const errors_1 = require("@ionic/cli-utils/lib/errors");
const init_1 = require("@ionic/cli-utils/lib/init");
const fs_1 = require("@ionic/cli-framework/utils/fs");
const guards_1 = require("@ionic/cli-utils/guards");
const commands_1 = require("./commands");
exports.namespace = new commands_1.IonicNamespace();
function generateRootPlugin() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { getPluginMeta } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/plugins'));
        return {
            namespace: exports.namespace,
            meta: yield getPluginMeta(__filename),
        };
    });
}
exports.generateRootPlugin = generateRootPlugin;
function run(pargv, env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        let err;
        let ienv;
        pargv = init_1.modifyArguments(pargv.slice(2));
        env['IONIC_CLI_LIB'] = __filename;
        const { isSuperAgentError } = yield Promise.resolve().then(() => require('@ionic/cli-utils/guards'));
        const { isValidationErrorArray } = yield Promise.resolve().then(() => require('@ionic/cli-framework/guards'));
        const plugin = yield generateRootPlugin();
        try {
            ienv = yield cli_utils_1.generateIonicEnvironment(plugin, pargv, env);
        }
        catch (e) {
            console.error(e.message ? e.message : (e.stack ? e.stack : e));
            process.exitCode = 1;
            return;
        }
        try {
            const config = yield ienv.config.load();
            ienv.log.debug(() => util.inspect(ienv.meta, { breakLength: Infinity, colors: chalk_1.default.enabled }));
            if (env['IONIC_EMAIL'] && env['IONIC_PASSWORD']) {
                ienv.log.debug(() => `${chalk_1.default.bold('IONIC_EMAIL')} / ${chalk_1.default.bold('IONIC_PASSWORD')} environment variables detected`);
                if (config.user.email !== env['IONIC_EMAIL']) {
                    ienv.log.debug(() => `${chalk_1.default.bold('IONIC_EMAIL')} mismatch with current session--attempting login`);
                    try {
                        yield ienv.session.login(env['IONIC_EMAIL'], env['IONIC_PASSWORD']);
                    }
                    catch (e) {
                        ienv.log.error(`Error occurred during automatic login via ${chalk_1.default.bold('IONIC_EMAIL')} / ${chalk_1.default.bold('IONIC_PASSWORD')} environment variables.`);
                        throw e;
                    }
                }
            }
            if (ienv.project.directory) {
                const nodeModulesExists = yield fs_1.pathExists(path.join(ienv.project.directory, 'node_modules'));
                if (!nodeModulesExists) {
                    const confirm = yield ienv.prompt({
                        type: 'confirm',
                        name: 'confirm',
                        message: `Looks like a fresh checkout! No ${chalk_1.default.green('./node_modules')} directory found. Would you like to install project dependencies?`,
                    });
                    if (confirm) {
                        ienv.log.info('Installing dependencies may take several minutes!');
                        const { pkgManagerArgs } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/utils/npm'));
                        const [installer, ...installerArgs] = yield pkgManagerArgs(ienv, { command: 'install' });
                        yield ienv.shell.run(installer, installerArgs, {});
                    }
                }
            }
            const argv = init_1.parseArgs(pargv, { boolean: true, string: '_' });
            // If an legacy command is being executed inform the user that there is a new command available
            const foundCommand = init_1.mapLegacyCommand(argv._[0]);
            if (foundCommand) {
                ienv.log.msg(`The ${chalk_1.default.green(argv._[0])} command has been renamed. To find out more, run:\n\n` +
                    `  ${chalk_1.default.green(`ionic ${foundCommand} --help`)}\n\n`);
            }
            else {
                const { loadPlugins } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/plugins'));
                try {
                    yield loadPlugins(ienv);
                }
                catch (e) {
                    if (e.fatal) {
                        throw e;
                    }
                    ienv.log.error(chalk_1.default.red.bold('Error occurred while loading plugins. CLI functionality may be limited.'));
                    ienv.log.debug(() => chalk_1.default.red(chalk_1.default.bold('Plugin error: ') + (e.stack ? e.stack : e)));
                }
                if (ienv.flags.interactive) {
                    if (yield ienv.config.isUpdatingEnabled()) {
                        const { checkForDaemon } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/daemon'));
                        yield checkForDaemon(ienv);
                        const { checkForUpdates, getLatestPluginVersion, versionNeedsUpdating } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/plugins'));
                        const latestVersion = yield getLatestPluginVersion(ienv, plugin.meta.name, plugin.meta.version);
                        if (latestVersion) {
                            plugin.meta.latestVersion = latestVersion;
                            plugin.meta.updateAvailable = yield versionNeedsUpdating(plugin.meta.version, latestVersion);
                            yield checkForUpdates(ienv);
                        }
                    }
                }
                yield ienv.hooks.fire('plugins:init', { env: ienv });
                yield exports.namespace.runCommand(ienv, pargv);
                config.state.lastCommand = now.toISOString();
            }
        }
        catch (e) {
            err = e;
        }
        try {
            yield Promise.all([
                ienv.config.save(),
                ienv.project.save(),
                ienv.daemon.save(),
            ]);
        }
        catch (e) {
            ienv.log.error(String(e.stack ? e.stack : e));
        }
        if (err) {
            ienv.tasks.fail();
            process.exitCode = 1;
            if (isValidationErrorArray(err)) {
                for (let e of err) {
                    ienv.log.error(e.message);
                }
                ienv.log.msg(`Use the ${chalk_1.default.green('--help')} flag for more details.`);
            }
            else if (isSuperAgentError(err)) {
                const { formatSuperAgentError } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/http'));
                ienv.log.msg(formatSuperAgentError(err));
            }
            else if (err.code && err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
                ienv.log.error(`Network connectivity error occurred, are you offline?\n` +
                    `If you are behind a firewall and need to configure proxy settings, see: ${chalk_1.default.bold('https://ionicframework.com/docs/cli/configuring.html#using-a-proxy')}\n\n` +
                    chalk_1.default.red(String(err.stack ? err.stack : err)));
            }
            else if (guards_1.isExitCodeException(err)) {
                process.exitCode = err.exitCode;
                if (err.message) {
                    if (err.exitCode > 0) {
                        ienv.log.error(err.message);
                    }
                    else {
                        ienv.log.msg(err.message);
                    }
                }
            }
            else if (err instanceof errors_1.Exception) {
                ienv.log.error(err.message);
            }
            else {
                ienv.log.msg(chalk_1.default.red(String(err.stack ? err.stack : err)));
                if (err.stack) {
                    ienv.log.debug(() => chalk_1.default.red(String(err.stack)));
                }
            }
        }
        yield ienv.close();
    });
}
exports.run = run;
