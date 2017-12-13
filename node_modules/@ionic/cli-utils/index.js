"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util = require("util");
const path = require("path");
const ci_info_1 = require("ci-info");
const chalk_1 = require("chalk");
const minimist = require("minimist");
const guards_1 = require("./guards");
const bootstrap_1 = require("./bootstrap");
const backends_1 = require("./lib/backends");
const config_1 = require("./lib/config");
const daemon_1 = require("./lib/daemon");
const http_1 = require("./lib/http");
const events_1 = require("./lib/events");
const environment_1 = require("./lib/environment");
const hooks_1 = require("./lib/hooks");
const project_1 = require("./lib/project");
const logger_1 = require("./lib/utils/logger");
const fs_1 = require("@ionic/cli-framework/utils/fs");
const task_1 = require("./lib/utils/task");
const npm_1 = require("./lib/utils/npm");
const telemetry_1 = require("./lib/telemetry");
const session_1 = require("./lib/session");
const shell_1 = require("./lib/shell");
const prompts_1 = require("./lib/prompts");
var backends_2 = require("./lib/backends");
exports.BACKEND_LEGACY = backends_2.BACKEND_LEGACY;
exports.BACKEND_PRO = backends_2.BACKEND_PRO;
exports.KNOWN_BACKENDS = backends_2.KNOWN_BACKENDS;
const name = '@ionic/cli-utils';
function registerHooks(hooks) {
    hooks.register(name, 'info', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const packageJson = yield npm_1.readPackageJsonFileOfResolvedModule(__filename);
        const version = packageJson.version || '';
        return [
            { type: 'cli-packages', key: name, value: version, path: path.dirname(__filename) },
        ];
    }));
    hooks.register(name, 'backend:changed', ({ env }) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const wasLoggedIn = yield env.session.isLoggedIn();
        yield env.session.logout();
        env.session = yield getSession(env.config, env.project, env.client);
        if (wasLoggedIn) {
            env.log.info('You have been logged out.');
        }
    }));
    hooks.register(name, 'info', ({ env, project }) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const osName = yield Promise.resolve().then(() => require('os-name'));
        const os = osName();
        const node = process.version;
        const npm = yield env.shell.cmdinfo('npm', ['-v']);
        const config = yield env.config.load();
        const info = [
            { type: 'cli-packages', key: 'ionic', flair: 'Ionic CLI', value: env.plugins.ionic.meta.version, path: path.dirname(path.dirname(env.plugins.ionic.meta.filePath)) },
            { type: 'system', key: 'Node', value: node },
            { type: 'system', key: 'npm', value: npm || 'not installed' },
            { type: 'system', key: 'OS', value: os },
            { type: 'misc', key: 'backend', value: config.backend },
        ];
        const projectFile = project.directory ? yield project.load() : undefined;
        if (projectFile) {
            if (projectFile.type === 'ionic1') {
                const { getIonic1Version } = yield Promise.resolve().then(() => require('./lib/ionic1/utils'));
                const ionic1Version = yield getIonic1Version(env);
                info.push({ type: 'local-packages', key: 'Ionic Framework', value: ionic1Version ? `ionic1 ${ionic1Version}` : 'unknown' });
            }
            else if (projectFile.type === 'ionic-angular') {
                const { getIonicAngularVersion, getAppScriptsVersion } = yield Promise.resolve().then(() => require('./lib/ionic-angular/utils'));
                const [ionicAngularVersion, appScriptsVersion] = yield Promise.all([getIonicAngularVersion(env, project), getAppScriptsVersion(env, project)]);
                info.push({ type: 'local-packages', key: 'Ionic Framework', value: ionicAngularVersion ? `ionic-angular ${ionicAngularVersion}` : 'not installed' });
                info.push({ type: 'local-packages', key: '@ionic/app-scripts', value: appScriptsVersion ? appScriptsVersion : 'not installed' });
            }
            if (projectFile.integrations.cordova && projectFile.integrations.cordova.enabled !== false) {
                const { getAndroidSdkToolsVersion } = yield Promise.resolve().then(() => require('./lib/android'));
                const { getCordovaCLIVersion, getCordovaPlatformVersions } = yield Promise.resolve().then(() => require('./lib/cordova/utils'));
                const [cordovaVersion, cordovaPlatforms, xcode, iosDeploy, iosSim, androidSdkToolsVersion,] = yield Promise.all([
                    getCordovaCLIVersion(env),
                    getCordovaPlatformVersions(env),
                    env.shell.cmdinfo('xcodebuild', ['-version']),
                    env.shell.cmdinfo('ios-deploy', ['--version']),
                    env.shell.cmdinfo('ios-sim', ['--version']),
                    getAndroidSdkToolsVersion(),
                ]);
                info.push({ type: 'global-packages', key: 'cordova', flair: 'Cordova CLI', value: cordovaVersion || 'not installed' });
                info.push({ type: 'local-packages', key: 'Cordova Platforms', value: cordovaPlatforms || 'none' });
                if (xcode) {
                    info.push({ type: 'system', key: 'Xcode', value: xcode });
                }
                if (iosDeploy) {
                    info.push({ type: 'system', key: 'ios-deploy', value: iosDeploy });
                }
                if (iosSim) {
                    info.push({ type: 'system', key: 'ios-sim', value: iosSim });
                }
                if (androidSdkToolsVersion) {
                    info.push({ type: 'system', key: 'Android SDK Tools', value: androidSdkToolsVersion });
                }
                info.push({ type: 'environment', key: 'ANDROID_HOME', value: process.env.ANDROID_HOME || 'not set' });
            }
            if (projectFile.integrations.gulp && projectFile.integrations.gulp.enabled !== false) {
                const { getGulpVersion } = yield Promise.resolve().then(() => require('./lib/gulp'));
                const gulpVersion = yield getGulpVersion(env);
                info.push({ type: 'global-packages', key: 'Gulp CLI', value: gulpVersion || 'not installed globally' });
            }
        }
        return info;
    }));
    hooks.register(name, 'cordova:project:info', ({ env }) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { ConfigXml } = yield Promise.resolve().then(() => require('./lib/cordova/config'));
        const conf = yield ConfigXml.load(env.project.directory);
        return conf.getProjectInfo();
    }));
}
function getSession(config, project, client) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const configData = yield config.load();
        return configData.backend === backends_1.BACKEND_LEGACY ? new session_1.CloudSession(config, project, client) : new session_1.ProSession(config, project, client);
    });
}
function generateIonicEnvironment(plugin, pargv, env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const cwd = process.cwd();
        const argv = minimist(pargv, { boolean: true, string: '_' });
        const config = new config_1.Config(env['IONIC_CONFIG_DIRECTORY'] || config_1.DEFAULT_CONFIG_DIRECTORY, config_1.CONFIG_FILE);
        const flags = config_1.gatherFlags(argv);
        let stream;
        let tasks;
        let bottomBar;
        let log;
        let level = 'info';
        let levelInvalid = false;
        let prefix = '';
        const configData = yield config.load();
        if (ci_info_1.isCI || configData.interactive === false) {
            flags.interactive = false;
        }
        if (argv['log-level']) {
            if (guards_1.isLogLevel(argv['log-level'])) {
                level = argv['log-level'];
            }
            else {
                levelInvalid = true;
            }
        }
        if (argv['log-timestamps']) {
            prefix = () => `${chalk_1.default.dim('[' + new Date().toISOString() + ']')}`;
        }
        if (flags.interactive) {
            const inquirer = yield Promise.resolve().then(() => require('inquirer'));
            bottomBar = new inquirer.ui.BottomBar();
            stream = bottomBar.log;
            log = new logger_1.Logger({ level, prefix, stream });
            tasks = new task_1.InteractiveTaskChain({ log, bottomBar });
        }
        else {
            stream = process.stdout;
            log = new logger_1.Logger({ level, prefix, stream });
            tasks = new task_1.TaskChain({ log });
        }
        const projectDir = yield fs_1.findBaseDirectory(cwd, project_1.PROJECT_FILE);
        env['IONIC_PROJECT_DIR'] = projectDir || '';
        env['IONIC_PROJECT_FILE'] = project_1.PROJECT_FILE;
        configData.version = plugin.meta.version;
        const project = new project_1.Project(env['IONIC_PROJECT_DIR'], project_1.PROJECT_FILE);
        const client = new http_1.Client(config);
        const session = yield getSession(config, project, client);
        const hooks = new hooks_1.HookEngine();
        const daemon = new daemon_1.Daemon(env['IONIC_DAEMON_DIRECTORY'] || config_1.DEFAULT_CONFIG_DIRECTORY, daemon_1.DAEMON_JSON_FILE);
        const telemetry = new telemetry_1.Telemetry();
        const shell = new shell_1.Shell({ tasks, log, project });
        registerHooks(hooks);
        yield Promise.all([config.prepare(), daemon.prepare()]);
        const ienv = new environment_1.Environment({
            bottomBar,
            client,
            config,
            daemon,
            events: new events_1.CLIEventEmitter(),
            flags,
            hooks,
            log,
            meta: {
                cwd,
                local: env['IONIC_CLI_LOCAL'] ? true : false,
                binPath: env['IONIC_CLI_BIN'],
                libPath: env['IONIC_CLI_LIB'],
            },
            namespace: plugin.namespace,
            plugins: {
                ionic: plugin,
            },
            prompt: yield prompts_1.createPromptModule({ confirm: flags.confirm, interactive: flags.interactive, log, config }),
            project,
            session,
            shell,
            tasks,
            telemetry,
        });
        telemetry.env = ienv; // TODO: proper DI
        yield ienv.open();
        if (env['IONIC_CLI_LOCAL_ERROR']) {
            log.debug(() => `Reason for not using local CLI: ${chalk_1.default.bold(env['IONIC_CLI_LOCAL_ERROR'])}`);
            if (env['IONIC_CLI_LOCAL_ERROR'] === bootstrap_1.ERROR_VERSION_TOO_OLD) {
                log.warn(`Detected locally installed Ionic CLI, but it's too old--using global CLI.`);
            }
        }
        if (levelInvalid) {
            log.warn(`${chalk_1.default.green(argv['log-level'])} is an invalid log level--defaulting back to ${chalk_1.default.bold(level)}.\n` +
                `You can choose from the following log levels: ${guards_1.LOG_LEVELS.map(l => chalk_1.default.green(l)).join(', ')}.\n`);
        }
        log.debug(() => `CLI flags: ${util.inspect(flags, { breakLength: Infinity, colors: chalk_1.default.enabled })}`);
        if (typeof argv['yarn'] === 'boolean') {
            log.warn(`${chalk_1.default.green('--yarn')} / ${chalk_1.default.green('--no-yarn')} switch is deprecated. Use ${chalk_1.default.green('ionic config set -g yarn ' + String(argv['yarn']))}.`);
            configData.yarn = argv['yarn'];
        }
        if (!projectDir) {
            const foundDir = yield fs_1.findBaseDirectory(cwd, project_1.PROJECT_FILE_LEGACY);
            if (foundDir) {
                log.warn(`${chalk_1.default.bold(project_1.PROJECT_FILE_LEGACY)} file found in ${chalk_1.default.bold(foundDir)}--please rename it to ${chalk_1.default.bold(project_1.PROJECT_FILE)}, or your project directory will not be detected!`);
            }
        }
        return ienv;
    });
}
exports.generateIonicEnvironment = generateIonicEnvironment;
