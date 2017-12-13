"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const html_1 = require("./html");
exports.DEV_SERVER_PREFIX = '__ionic';
function injectDevServerScript(content) {
    if (content.indexOf(`/${exports.DEV_SERVER_PREFIX}/dev-server.js`) > -1) {
        // already added script
        return content;
    }
    const devServerScript = getDevServerScript();
    return html_1.injectScript(content, devServerScript);
}
exports.injectDevServerScript = injectDevServerScript;
function getDevServerScript() {
    return `
    <!-- Ionic Dev Server: Injected Dev Server Script -->
    <script src="${exports.DEV_SERVER_PREFIX}/dev-server.js" async="" defer=""></script>
`;
}
function createLiveReloadServer(env, { port, wwwDir }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tinylr = yield Promise.resolve().then(() => require('tiny-lr'));
        const lrserver = tinylr();
        lrserver.listen(port);
        return (changedFiles) => {
            lrserver.changed({
                body: {
                    files: changedFiles.map(changedFile => ('/' + path.relative(wwwDir, changedFile)))
                }
            });
        };
    });
}
exports.createLiveReloadServer = createLiveReloadServer;
function injectLiveReloadScript(content, port) {
    if (content.indexOf('/livereload.js') > -1) {
        // already added script
        return content;
    }
    const liveReloadScript = getLiveReloadScript(port);
    return html_1.injectScript(content, liveReloadScript);
}
exports.injectLiveReloadScript = injectLiveReloadScript;
function getLiveReloadScript(port) {
    const src = `${exports.DEV_SERVER_PREFIX}/tiny-lr/livereload.js`;
    return `
    <!-- Ionic Dev Server: Injected LiveReload Script -->
    <script>
      window.LiveReloadOptions = {
        host: window.location.hostname,
        port: ${port},
        snipver: true,
      };
    </script>
    <script src="${src}" async="" defer=""></script>
`;
}
