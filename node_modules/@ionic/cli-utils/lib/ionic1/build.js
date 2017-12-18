"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = require("chalk");
function build({ env, options }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const project = yield env.project.load();
        if (project.integrations.gulp && project.integrations.gulp.enabled !== false) {
            const { runTask } = yield Promise.resolve().then(() => require('../gulp'));
            yield runTask(env, 'sass');
        }
        else {
            env.log.warn(`Not performing Ionic build for project type: ${chalk_1.default.bold(project.type)}.`);
        }
    });
}
exports.build = build;
