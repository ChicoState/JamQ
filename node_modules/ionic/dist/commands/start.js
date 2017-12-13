"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const chalk_1 = require("chalk");
const lib_1 = require("@ionic/cli-framework/lib");
const cli_utils_1 = require("@ionic/cli-utils");
const command_1 = require("@ionic/cli-utils/lib/command");
const errors_1 = require("@ionic/cli-utils/lib/errors");
const fs_1 = require("@ionic/cli-framework/utils/fs");
const project_1 = require("@ionic/cli-utils/lib/project");
const emoji_1 = require("@ionic/cli-utils/lib/utils/emoji");
let StartCommand = class StartCommand extends command_1.Command {
    preRun(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { STARTER_TEMPLATES, getStarterTemplateTextList } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/start'));
            const { promptToLogin } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/session'));
            // If the action is list then lets just end here.
            if (options['list']) {
                this.env.log.msg(getStarterTemplateTextList(STARTER_TEMPLATES).join('\n'));
                throw new errors_1.FatalException('', 0);
            }
            if (options['skip-deps']) {
                this.env.log.warn(`The ${chalk_1.default.green('--skip-deps')} option has been deprecated. Please use ${chalk_1.default.green('--no-deps')}.`);
                options['deps'] = false;
            }
            if (options['skip-link']) {
                this.env.log.warn(`The ${chalk_1.default.green('--skip-link')} option has been deprecated. Please use ${chalk_1.default.green('--no-link')}.`);
                options['link'] = false;
            }
            if (options['pro-id']) {
                if (options['link'] === false) {
                    this.env.log.warn(`The ${chalk_1.default.green('--no-link')} option has no effect with ${chalk_1.default.green('--pro-id')}.`);
                }
                options['link'] = true;
            }
            const proAppId = options['pro-id'] ? String(options['pro-id']) : undefined;
            const config = yield this.env.config.load();
            if (proAppId && config.backend !== cli_utils_1.BACKEND_PRO) {
                yield this.env.runCommand(['config', 'set', '-g', 'backend', 'pro'], {});
                this.env.log.nl();
                this.env.log.info(`${chalk_1.default.bold(chalk_1.default.blue.underline('Welcome to Ionic Pro!') + ' The CLI is now set up to use Ionic Pro services.')}\n` +
                    `You can revert back to Ionic Cloud (legacy) services at any time:\n\n` +
                    `${chalk_1.default.green('ionic config set -g backend legacy')}\n`);
            }
            if (this.env.project.directory) {
                const confirm = yield this.env.prompt({
                    type: 'confirm',
                    name: 'confirm',
                    message: 'You are already in an Ionic project directory. Do you really want to start another project here?',
                    default: false,
                });
                if (!confirm) {
                    this.env.log.info('Not starting project within existing project.');
                    throw new errors_1.FatalException();
                }
            }
            if (options['v1'] || options['v2']) {
                const type = options['v1'] ? 'ionic1' : 'ionic-angular';
                throw new errors_1.FatalException(`Sorry! The ${chalk_1.default.green('--v1')} and ${chalk_1.default.green('--v2')} flags have been removed.\n` +
                    `Use the ${chalk_1.default.green('--type')} option. (${chalk_1.default.green('ionic start --help')})\n\n` +
                    `For ${chalk_1.default.bold(this.env.project.formatType(type))} projects, try ${chalk_1.default.green('ionic start ' + (inputs.length > 0 ? inputs.join(' ') + ' ' : '') + '--type=' + type)}`);
            }
            if (options['app-name']) {
                this.env.log.warn(`The ${chalk_1.default.green('--app-name')} option has been deprecated, please use ${chalk_1.default.green('--display-name')}.`);
                options['display-name'] = options['app-name'];
            }
            if (options['bundle-id']) {
                this.env.log.info(`${chalk_1.default.green('--bundle-id')} detected, using ${chalk_1.default.green('--cordova')}`);
                options['cordova'] = true;
            }
            if (proAppId) {
                if (!(yield this.env.session.isLoggedIn())) {
                    yield promptToLogin(this.env);
                }
            }
            if (!inputs[0]) {
                if (proAppId) {
                    const { App } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/app'));
                    const token = yield this.env.session.getUserToken();
                    const appLoader = new App(token, this.env.client);
                    const app = yield appLoader.load(proAppId);
                    this.env.log.info(`Using ${chalk_1.default.bold(app.slug)} for ${chalk_1.default.green('name')}.`);
                    inputs[0] = app.slug;
                }
                else {
                    const name = yield this.env.prompt({
                        type: 'input',
                        name: 'name',
                        message: 'What would you like to name your project:',
                        validate: v => lib_1.validators.required(v, 'name'),
                    });
                    inputs[0] = name;
                }
            }
            if (!inputs[1]) {
                const template = yield this.env.prompt({
                    type: 'list',
                    name: 'template',
                    message: 'What starter would you like to use:',
                    choices: () => {
                        const starterTemplates = STARTER_TEMPLATES.filter(st => st.type === options['type']);
                        return getStarterTemplateTextList(starterTemplates)
                            .map((text, i) => {
                            return {
                                name: text,
                                short: starterTemplates[i].name,
                                value: starterTemplates[i].name
                            };
                        });
                    }
                });
                inputs[1] = template;
            }
        });
    }
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { getHelloText } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/start'));
            const { pkgManagerArgs } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/utils/npm'));
            const [name, template] = inputs;
            const displayName = options['display-name'] ? String(options['display-name']) : name;
            const proAppId = options['pro-id'] ? String(options['pro-id']) : undefined;
            const clonedApp = template.includes(':');
            let linkConfirmed = typeof proAppId === 'string';
            const config = yield this.env.config.load();
            const gitIntegration = options['git'] ? yield this.isGitSetup() : false;
            if (proAppId && config.backend === cli_utils_1.BACKEND_PRO && !gitIntegration) {
                throw new errors_1.FatalException(`Git CLI not found on your PATH. It must be installed to connect this app to Ionic.\n` +
                    `See installation docs for git: ${chalk_1.default.bold('https://git-scm.com/book/en/v2/Getting-Started-Installing-Git')}`);
            }
            const projectDir = path.resolve(name);
            yield this.validateName(name);
            yield this.ensureDirectory(name, projectDir);
            if (clonedApp) {
                yield this.env.shell.run('git', ['clone', template, name, '--progress'], { showExecution: true });
            }
            else {
                const starterTemplate = yield this.findStarterTemplate(template, String(options['type']));
                yield this.downloadStarterTemplate(projectDir, starterTemplate);
            }
            // start is weird, once the project directory is created, it becomes a
            // "project" command and so we replace the `Project` instance that was
            // autogenerated when the CLI booted up. This has worked thus far?
            this.env.project = new project_1.Project(projectDir, project_1.PROJECT_FILE);
            const shellOptions = { cwd: projectDir };
            if (!clonedApp) {
                if (!options['cordova']) {
                    const confirm = yield this.env.prompt({
                        type: 'confirm',
                        name: 'confirm',
                        message: 'Would you like to integrate your new app with Cordova to target native iOS and Android?',
                        default: false,
                    });
                    if (confirm) {
                        options['cordova'] = true;
                    }
                }
                yield this.personalizeApp(projectDir, name, displayName);
                if (options['cordova']) {
                    yield this.env.runCommand(['integrations', 'enable', 'cordova', '--quiet']);
                    const bundleId = options['bundle-id'] ? String(options['bundle-id']) : undefined;
                    yield this.personalizeCordovaApp(projectDir, name, bundleId);
                }
                this.env.log.nl();
            }
            if (options['deps']) {
                this.env.log.info('Installing dependencies may take several minutes.');
                this.env.log.msg('\n');
                this.env.log.msg(chalk_1.default.bold(`  ${emoji_1.emoji('✨', '*')}   IONIC  DEVAPP  ${emoji_1.emoji('✨', '*')}`));
                this.env.log.msg('\n Speed up development with the ' + chalk_1.default.bold('Ionic DevApp') +
                    ', our fast, on-device testing mobile app\n\n');
                this.env.log.msg(`  -  ${emoji_1.emoji('🔑', '')}   Test on iOS and Android without Native SDKs`);
                this.env.log.msg(`  -  ${emoji_1.emoji('🚀', '')}   LiveReload for instant style and JS updates`);
                this.env.log.msg('\n ️-->    Install DevApp: ' + chalk_1.default.bold('https://bit.ly/ionic-dev-app') + '    <--\n\n');
                const [installer, ...installerArgs] = yield pkgManagerArgs(this.env, { command: 'install' });
                yield this.env.shell.run(installer, installerArgs, shellOptions);
            }
            if (!clonedApp) {
                if (gitIntegration) {
                    yield this.env.shell.run('git', ['init'], Object.assign({ showSpinner: false }, shellOptions));
                }
                if (config.backend === cli_utils_1.BACKEND_PRO) {
                    if (options['link'] && !linkConfirmed) {
                        this.env.log.msg('\n' + chalk_1.default.bold(`  ${emoji_1.emoji('🔥', '*')}   IONIC  PRO  ${emoji_1.emoji('🔥', '*')}`));
                        this.env.log.msg('\n Supercharge your Ionic development with the ' + chalk_1.default.bold('Ionic Pro') + ' SDK\n\n');
                        this.env.log.msg(`  -  ${emoji_1.emoji('⚠️', '')}   Track runtime errors in real-time, back to your original TypeScript`);
                        this.env.log.msg(`  -  ${emoji_1.emoji('📲', '')}   Push remote updates and skip the app store queue`);
                        this.env.log.msg(`\nLearn more about Ionic Pro: ${chalk_1.default.bold('https://ionicframework.com/products')}\n`);
                        const confirm = yield this.env.prompt({
                            type: 'confirm',
                            name: 'confirm',
                            message: 'Install the free Ionic Pro SDK and connect your app?',
                            noninteractiveValue: false,
                        });
                        this.env.log.msg('\n-----------------------------------\n\n');
                        if (confirm) {
                            linkConfirmed = true;
                        }
                    }
                    if (linkConfirmed) {
                        const [installer, ...installerArgs] = yield pkgManagerArgs(this.env, { pkg: '@ionic/pro' });
                        yield this.env.shell.run(installer, installerArgs, shellOptions);
                        const cmdArgs = ['link'];
                        if (proAppId) {
                            cmdArgs.push(proAppId);
                        }
                        yield this.env.runCommand(cmdArgs);
                    }
                }
                const manifestPath = path.resolve(projectDir, 'ionic.starter.json');
                const manifest = yield this.loadManifest(manifestPath);
                if (manifest) {
                    yield fs_1.fsUnlink(manifestPath);
                }
                if (gitIntegration) {
                    yield this.env.shell.run('git', ['add', '-A'], Object.assign({ showSpinner: false }, shellOptions));
                    yield this.env.shell.run('git', ['commit', '-m', 'Initial commit', '--no-gpg-sign'], Object.assign({ showSpinner: false }, shellOptions));
                }
                if (config.backend === cli_utils_1.BACKEND_LEGACY) {
                    this.env.log.info(getHelloText());
                }
                if (manifest) {
                    yield this.performManifestOps(manifest);
                }
            }
            this.env.log.nl();
            yield this.showNextSteps(projectDir, linkConfirmed);
        });
    }
    isGitSetup() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const config = yield this.env.config.load();
            const cmdInstalled = yield this.env.shell.cmdinfo('git', ['--version']);
            if (cmdInstalled) {
                return true;
            }
            if (config.backend === cli_utils_1.BACKEND_LEGACY) {
                this.env.log.warn(`Git CLI not found on your PATH. You may wish to install it to version control your app.\n` +
                    `See installation docs for git: ${chalk_1.default.bold('https://git-scm.com/book/en/v2/Getting-Started-Installing-Git')}\n\n` +
                    `Use ${chalk_1.default.green('--no-git')} to disable this warning.\n`);
            }
            return false;
        });
    }
    ensureDirectory(projectName, projectDir) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { isSafeToCreateProjectIn } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/start'));
            const { prettyPath } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/utils/format'));
            const projectExists = yield fs_1.pathExists(projectName);
            if (!projectExists) {
                this.env.tasks.next(`Creating directory ${chalk_1.default.green(prettyPath(projectDir))}`);
                yield fs_1.fsMkdir(projectDir, 0o777);
            }
            else if (!(yield isSafeToCreateProjectIn(projectDir))) {
                const confirm = yield this.env.prompt({
                    type: 'confirm',
                    name: 'confirm',
                    message: (`The directory ${chalk_1.default.green(projectName)} contains file(s) that could conflict. ` +
                        'Would you like to overwrite the directory with this new project?'),
                    default: false,
                });
                if (confirm) {
                    this.env.tasks.next(`Creating directory ${chalk_1.default.green(prettyPath(projectDir))}`);
                    yield fs_1.removeDirectory(projectDir);
                    yield fs_1.fsMkdir(projectDir, 0o777);
                }
                else {
                    throw new errors_1.FatalException(`Not erasing existing project in ${chalk_1.default.green(prettyPath(projectDir))}.`, 0);
                }
            }
            this.env.tasks.end();
        });
    }
    findStarterTemplate(template, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { STARTER_BASE_URL, STARTER_TEMPLATES, getStarterList } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/start'));
            const starterTemplate = STARTER_TEMPLATES.find(t => t.type === type && t.name === template);
            if (starterTemplate) {
                return starterTemplate;
            }
            this.env.tasks.next('Looking up starter');
            const starterList = yield getStarterList(this.env.config);
            const starter = starterList.starters.find(t => t.type === type && t.name === template);
            if (starter) {
                return {
                    strip: false,
                    name: starter.name,
                    type: starter.type,
                    description: '',
                    archive: `${STARTER_BASE_URL}/${starter.id}.tar.gz`,
                };
            }
            else {
                throw new errors_1.FatalException(`Unable to find starter template for ${chalk_1.default.green(template)}\n` +
                    `If this is not a typo, please make sure it is a valid starter template within the starters repo: ${chalk_1.default.bold('https://github.com/ionic-team/starters')}`);
            }
        });
    }
    validateName(name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { isValidPackageName } = yield Promise.resolve().then(() => require('@ionic/cli-framework/utils/npm'));
            const { isProjectNameValid } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/start'));
            if (!isProjectNameValid(name)) {
                throw new errors_1.FatalException(`Please name your Ionic project something meaningful other than ${chalk_1.default.green(name)}`);
            }
            if (!isValidPackageName(name) || name !== path.basename(name)) {
                throw new errors_1.FatalException(`${chalk_1.default.green(name)} is not a valid package or directory name.\n` +
                    `Please choose a different name. Alphanumeric characters are always safe for app names. You can use the ${chalk_1.default.green('--display-name')} option for the human-readable name.`);
            }
        });
    }
    loadManifest(manifestPath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { prettyPath } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/utils/format'));
            const { readStarterManifest } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/start'));
            try {
                return yield readStarterManifest(manifestPath);
            }
            catch (e) {
                this.env.log.debug(`Error with manifest file ${chalk_1.default.bold(prettyPath(manifestPath))}: ${e}`);
            }
        });
    }
    performManifestOps(manifest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (manifest.welcome) {
                this.env.log.nl();
                this.env.log.msg(`${chalk_1.default.bold('Starter Welcome')}:\n`);
                this.env.log.info(manifest.welcome);
            }
        });
    }
    personalizeApp(projectDir, name, displayName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { updatePackageJsonForCli } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/start'));
            const project = yield this.env.project.load();
            this.env.tasks.next(`Personalizing ${chalk_1.default.bold('ionic.config.json')} and ${chalk_1.default.bold('package.json')}`);
            project.name = displayName;
            yield updatePackageJsonForCli(projectDir, name);
            yield this.env.project.save();
            this.env.tasks.end();
        });
    }
    personalizeCordovaApp(projectDir, name, bundleId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { ConfigXml } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/cordova/config'));
            const conf = yield ConfigXml.load(projectDir);
            conf.setName(name);
            if (bundleId) {
                conf.setBundleId(bundleId);
            }
            yield conf.save();
        });
    }
    downloadStarterTemplate(projectDir, starterTemplate) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { download } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/http'));
            const { createTarExtraction } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/utils/archive'));
            const task = this.env.tasks.next(`Downloading and extracting ${chalk_1.default.green(starterTemplate.name.toString())} starter`);
            const ws = yield createTarExtraction({ cwd: projectDir, strip: starterTemplate.strip ? 1 : 0 });
            yield download(this.env.config, starterTemplate.archive, ws, {
                progress: (loaded, total) => task.progress(loaded, total),
            });
            this.env.tasks.end();
        });
    }
    showNextSteps(projectDir, linkConfirmed) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { prettyPath } = yield Promise.resolve().then(() => require('@ionic/cli-utils/lib/utils/format'));
            const config = yield this.env.config.load();
            this.env.log.msg(`${chalk_1.default.bold('Next Steps')}:\n`);
            this.env.log.msg(`* Go to your newly created project: ${chalk_1.default.green(`cd ${prettyPath(projectDir)}`)}`);
            this.env.log.msg(`* Get Ionic DevApp for easy device testing: ${chalk_1.default.bold('https://bit.ly/ionic-dev-app')}`);
            if (config.backend === cli_utils_1.BACKEND_PRO && linkConfirmed) {
                this.env.log.msg(`* Finish setting up Ionic Pro Error Monitoring: ${chalk_1.default.bold('https://ionicframework.com/docs/pro/monitoring/#getting-started')}\n`);
                this.env.log.msg(`* Finally, push your code to Ionic Pro to perform real-time updates, and more: ${chalk_1.default.green('git push ionic master')}`);
            }
            this.env.log.nl();
        });
    }
};
StartCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'start',
        type: 'global',
        description: 'Create a new project',
        longDescription: `
This command creates a working Ionic app. It installs dependencies for you and sets up your project.

${chalk_1.default.green('ionic start')} will create a new app from ${chalk_1.default.green('template')}. You can list all templates with the ${chalk_1.default.green('--list')} option. For more information on starter templates, see the CLI documentation${chalk_1.default.cyan('[1]')}.

You can also specify a git repository URL for ${chalk_1.default.green('template')} and your existing project will be cloned.

${chalk_1.default.cyan('[1]')}: ${chalk_1.default.bold('https://ionicframework.com/docs/cli/starters.html')}
`,
        exampleCommands: [
            '',
            '--list',
            'myApp blank',
            'myApp tabs --cordova',
            'myApp blank --type=ionic1',
            'myConferenceApp https://github.com/ionic-team/ionic-conference-app',
        ],
        inputs: [
            {
                name: 'name',
                description: 'The name of your project directory',
            },
            {
                name: 'template',
                description: `The starter template to use (e.g. ${['blank', 'tabs'].map(t => chalk_1.default.green(t)).join(', ')}; use ${chalk_1.default.green('--list')} to see all)`,
            }
        ],
        options: [
            {
                name: 'list',
                description: 'List starter templates available',
                type: Boolean,
                aliases: ['l'],
            },
            {
                name: 'type',
                description: `Type of project to start (e.g. ${chalk_1.default.green('ionic-angular')}, ${chalk_1.default.green('ionic1')})`,
                type: String,
                default: 'ionic-angular',
            },
            {
                name: 'display-name',
                description: 'Human-readable name (use quotes around the name)',
                type: String,
                aliases: ['n'],
            },
            {
                name: 'cordova',
                description: 'Include Cordova integration',
                type: Boolean,
            },
            {
                name: 'deps',
                description: 'Do not install npm/yarn dependencies',
                type: Boolean,
                default: true,
                advanced: true,
            },
            {
                name: 'git',
                description: 'Do not initialize a git repo',
                type: Boolean,
                default: true,
                advanced: true,
            },
            {
                name: 'link',
                description: 'Do not ask to connect the app with the Ionic Dashboard',
                type: Boolean,
                default: true,
                advanced: true,
            },
            {
                name: 'pro-id',
                description: 'Specify an app ID from the Ionic Dashboard to link',
            },
            {
                name: 'bundle-id',
                description: 'Specify the bundle ID/application ID for your app (reverse-DNS notation)',
                advanced: true,
            },
        ],
    })
], StartCommand);
exports.StartCommand = StartCommand;
