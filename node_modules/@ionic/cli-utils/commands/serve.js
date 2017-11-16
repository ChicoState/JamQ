"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os = require("os");
const chalk_1 = require("chalk");
const string_1 = require("@ionic/cli-framework/utils/string");
const errors_1 = require("../lib/errors");
const serve_1 = require("../lib/serve");
const WATCH_BEFORE_HOOK = 'watch:before';
const WATCH_BEFORE_SCRIPT = `ionic:${WATCH_BEFORE_HOOK}`;
function serve(env, inputs, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { detectAndWarnAboutDeprecatedPlugin } = yield Promise.resolve().then(() => require('../lib/plugins'));
        const packageJson = yield env.project.loadPackageJson();
        if (packageJson.scripts && packageJson.scripts[WATCH_BEFORE_SCRIPT]) {
            env.log.debug(() => `Invoking ${chalk_1.default.cyan(WATCH_BEFORE_SCRIPT)} npm script.`);
            yield env.shell.run('npm', ['run', WATCH_BEFORE_SCRIPT], { showExecution: true });
        }
        if (packageJson.devDependencies) {
            if (packageJson.devDependencies['gulp']) {
                const { checkGulp, registerWatchEvents, runTask } = yield Promise.resolve().then(() => require('../lib/gulp'));
                yield checkGulp(env);
                yield registerWatchEvents(env);
                yield runTask(env, WATCH_BEFORE_SCRIPT);
            }
            yield detectAndWarnAboutDeprecatedPlugin(env, '@ionic/cli-plugin-cordova');
            yield detectAndWarnAboutDeprecatedPlugin(env, '@ionic/cli-plugin-ionic-angular');
            yield detectAndWarnAboutDeprecatedPlugin(env, '@ionic/cli-plugin-ionic1');
            yield detectAndWarnAboutDeprecatedPlugin(env, '@ionic/cli-plugin-gulp');
            if (packageJson.devDependencies['@ionic/cli-plugin-cordova']) {
                const { checkCordova } = yield Promise.resolve().then(() => require('../lib/cordova/utils'));
                yield checkCordova(env);
            }
        }
        yield env.hooks.fire('watch:before', { env });
        const [platform] = inputs;
        let details;
        const serveOptions = cliOptionsToServeOptions(options);
        const project = yield env.project.load();
        const devAppDetails = yield serve_1.gatherDevAppDetails(env, serveOptions);
        if (project.type === 'ionic1') {
            const { serve } = yield Promise.resolve().then(() => require('../lib/ionic1/serve'));
            details = yield serve({ env, options: serveOptions });
        }
        else if (project.type === 'ionic-angular') {
            const { serve } = yield Promise.resolve().then(() => require('../lib/ionic-angular/serve'));
            details = yield serve({ env, options: Object.assign({ platform, target: serveOptions.iscordovaserve ? 'cordova' : undefined }, serveOptions) });
        }
        else {
            throw new errors_1.FatalException(`Cannot perform Ionic serve/watch for project type: ${chalk_1.default.bold(project.type)}.\n` +
                (project.type === 'custom' ? `Since you're using the ${chalk_1.default.bold('custom')} project type, this command won't work. The Ionic CLI doesn't know how to serve custom projects.\n\n` : '') +
                `If you'd like the CLI to try to detect your project type, you can unset the ${chalk_1.default.bold('type')} attribute in ${chalk_1.default.bold('ionic.config.json')}.\n`);
        }
        if (devAppDetails) {
            const devAppName = yield serve_1.publishDevApp(env, serveOptions, Object.assign({ port: details.port }, devAppDetails));
            devAppDetails.channel = devAppName;
        }
        const localAddress = `http://localhost:${details.port}`;
        const fmtExternalAddress = (address) => `http://${address}:${details.port}`;
        env.log.ok(`Development server running!\n` +
            `Local: ${chalk_1.default.bold(localAddress)}\n` +
            (details.externalNetworkInterfaces.length > 0 ? `External: ${details.externalNetworkInterfaces.map(v => chalk_1.default.bold(fmtExternalAddress(v.address))).join(', ')}\n` : '') +
            (serveOptions.basicAuth ? `Basic Auth: ${chalk_1.default.bold(serveOptions.basicAuth[0])} / ${chalk_1.default.bold(serveOptions.basicAuth[1])}` : '') +
            (devAppDetails && devAppDetails.channel ? `DevApp: ${chalk_1.default.bold(devAppDetails.channel)} on ${chalk_1.default.bold(os.hostname())}` : ''));
        if (serveOptions.open) {
            const openOptions = [localAddress]
                .concat(serveOptions.lab ? [serve_1.IONIC_LAB_URL] : [])
                .concat(serveOptions.browserOption ? [serveOptions.browserOption] : [])
                .concat(platform ? ['?ionicplatform=', platform] : []);
            const opn = yield Promise.resolve().then(() => require('opn'));
            opn(openOptions.join(''), { app: serveOptions.browser, wait: false });
        }
        return details;
    });
}
exports.serve = serve;
function cliOptionsToServeOptions(options) {
    if (options['local']) {
        options['address'] = 'localhost';
        options['devapp'] = false;
    }
    const address = options['address'] ? String(options['address']) : serve_1.BIND_ALL_ADDRESS;
    const port = string_1.str2num(options['port'], serve_1.DEFAULT_SERVER_PORT);
    const livereloadPort = string_1.str2num(options['livereload-port'], serve_1.DEFAULT_LIVERELOAD_PORT);
    const notificationPort = string_1.str2num(options['dev-logger-port'], serve_1.DEFAULT_DEV_LOGGER_PORT);
    return {
        address,
        port,
        livereloadPort,
        notificationPort,
        consolelogs: options['consolelogs'] ? true : false,
        serverlogs: options['serverlogs'] ? true : false,
        livereload: typeof options['livereload'] === 'boolean' ? Boolean(options['livereload']) : true,
        proxy: typeof options['proxy'] === 'boolean' ? Boolean(options['proxy']) : true,
        lab: options['lab'] ? true : false,
        open: options['open'] ? true : false,
        browser: options['browser'] ? String(options['browser']) : undefined,
        browserOption: options['browseroption'] ? String(options['browseroption']) : undefined,
        basicAuth: options['auth'] ? ['ionic', String(options['auth'])] : undefined,
        env: options['env'] ? String(options['env']) : undefined,
        devapp: typeof options['devapp'] === 'undefined' || options['devapp'] ? true : false,
        externalAddressRequired: options['externalAddressRequired'] ? true : false,
        iscordovaserve: typeof options['iscordovaserve'] === 'boolean' ? Boolean(options['iscordovaserve']) : false,
    };
}
exports.cliOptionsToServeOptions = cliOptionsToServeOptions;
