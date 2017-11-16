"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = require("chalk");
const BUILD_BEFORE_HOOK = 'build:before';
const BUILD_BEFORE_SCRIPT = `ionic:${BUILD_BEFORE_HOOK}`;
const BUILD_AFTER_HOOK = 'build:after';
const BUILD_AFTER_SCRIPT = `ionic:${BUILD_AFTER_HOOK}`;
function build(env, inputs, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { detectAndWarnAboutDeprecatedPlugin } = yield Promise.resolve().then(() => require('../lib/plugins'));
        const [platform] = inputs;
        const packageJson = yield env.project.loadPackageJson();
        if (packageJson.scripts && packageJson.scripts[BUILD_BEFORE_SCRIPT]) {
            env.log.debug(() => `Invoking ${chalk_1.default.cyan(BUILD_BEFORE_SCRIPT)} npm script.`);
            yield env.shell.run('npm', ['run', BUILD_BEFORE_SCRIPT], { showExecution: true });
        }
        if (packageJson.devDependencies) {
            if (packageJson.devDependencies['gulp']) {
                const { checkGulp, runTask } = yield Promise.resolve().then(() => require('../lib/gulp'));
                yield checkGulp(env);
                yield runTask(env, BUILD_BEFORE_SCRIPT);
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
        yield env.hooks.fire(BUILD_BEFORE_HOOK, { env });
        const project = yield env.project.load();
        if (project.type === 'ionic-angular') {
            const { build } = yield Promise.resolve().then(() => require('../lib/ionic-angular/build'));
            yield build({ env, options: Object.assign({ platform }, options) });
        }
        else {
            const { build } = yield Promise.resolve().then(() => require('../lib/ionic1/build'));
            yield build({ env, options: Object.assign({ platform }, options) });
        }
        if (packageJson.scripts && packageJson.scripts[BUILD_AFTER_SCRIPT]) {
            env.log.debug(() => `Invoking ${chalk_1.default.cyan(BUILD_AFTER_SCRIPT)} npm script.`);
            yield env.shell.run('npm', ['run', BUILD_AFTER_SCRIPT], { showExecution: true });
        }
        if (packageJson.devDependencies) {
            if (packageJson.devDependencies['gulp']) {
                const { checkGulp, runTask } = yield Promise.resolve().then(() => require('../lib/gulp'));
                yield checkGulp(env);
                yield runTask(env, BUILD_AFTER_SCRIPT);
            }
        }
        yield env.hooks.fire(BUILD_AFTER_HOOK, { env, platform });
    });
}
exports.build = build;
