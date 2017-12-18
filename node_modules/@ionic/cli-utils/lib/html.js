"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function injectScript(content, code) {
    let match = content.match(/<\/body>(?![\s\S]*<\/body>)/i);
    if (!match) {
        match = content.match(/<\/html>(?![\s\S]*<\/html>)/i);
    }
    if (match) {
        content = content.replace(match[0], `${code}${match[0]}`);
    }
    else {
        content += code;
    }
    return content;
}
exports.injectScript = injectScript;
