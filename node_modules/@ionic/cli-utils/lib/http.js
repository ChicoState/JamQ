"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util = require("util");
const chalk = require("chalk");
const guards_1 = require("../guards");
const http_1 = require("./utils/http");
const fs_1 = require("./utils/fs");
const errors_1 = require("./errors");
const FORMAT_ERROR_BODY_MAX_LENGTH = 1000;
exports.CONTENT_TYPE_JSON = 'application/json';
exports.ERROR_UNKNOWN_CONTENT_TYPE = 'UNKNOWN_CONTENT_TYPE';
exports.ERROR_UNKNOWN_RESPONSE_FORMAT = 'UNKNOWN_RESPONSE_FORMAT';
let CAS;
let CERTS;
let KEYS;
function createRawRequest(method, url) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const superagent = yield Promise.resolve().then(function () { return require('superagent'); });
        const req = superagent(method, url);
        return { req };
    });
}
exports.createRawRequest = createRawRequest;
function createRequest(config, method, url) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const c = yield config.load();
        const [proxy,] = http_1.getGlobalProxy();
        const { req } = yield createRawRequest(method, url);
        if (proxy && req.proxy) {
            req.proxy(proxy);
        }
        if (c.ssl) {
            const conform = (p) => {
                if (!p) {
                    return [];
                }
                if (typeof p === 'string') {
                    return [p];
                }
                return p;
            };
            if (!CAS) {
                CAS = yield Promise.all(conform(c.ssl.cafile).map(p => fs_1.fsReadFile(p, { encoding: 'utf8' })));
            }
            if (!CERTS) {
                CERTS = yield Promise.all(conform(c.ssl.certfile).map(p => fs_1.fsReadFile(p, { encoding: 'utf8' })));
            }
            if (!KEYS) {
                KEYS = yield Promise.all(conform(c.ssl.keyfile).map(p => fs_1.fsReadFile(p, { encoding: 'utf8' })));
            }
            if (CAS.length > 0) {
                req.ca(CAS);
            }
            if (CERTS.length > 0) {
                req.cert(CERTS);
            }
            if (KEYS.length > 0) {
                req.key(KEYS);
            }
        }
        return { req };
    });
}
exports.createRequest = createRequest;
class Client {
    constructor(config) {
        this.config = config;
    }
    make(method, path) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const url = path.startsWith('http://') || path.startsWith('https://') ? path : `${yield this.config.getAPIUrl()}${path}`;
            const { req } = yield createRequest(this.config, method, url);
            req
                .set('Content-Type', exports.CONTENT_TYPE_JSON)
                .set('Accept', exports.CONTENT_TYPE_JSON);
            return { req };
        });
    }
    do(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield req;
            const r = transformAPIResponse(res);
            if (guards_1.isAPIResponseError(r)) {
                throw new errors_1.FatalException('API request was successful, but the response output format was that of an error.\n'
                    + formatAPIError(req, r));
            }
            return r;
        });
    }
    paginate(reqgen, guard) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Paginator(this, reqgen, guard);
        });
    }
}
exports.Client = Client;
class Paginator {
    constructor(client, reqgen, guard) {
        this.client = client;
        this.reqgen = reqgen;
        this.guard = guard;
        this.done = false;
    }
    next() {
        if (this.done) {
            return { done: true }; // TODO: why can't I exclude value?
        }
        return {
            done: false,
            value: (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const { req } = yield this.reqgen();
                if (!this.previousReq) {
                    this.previousReq = req;
                }
                const page = this.previousReq.qs.page && !isNaN(Number(this.previousReq.qs.page)) ? this.previousReq.qs.page + 1 : 1;
                const pageSize = this.previousReq.qs.page_size && !isNaN(Number(this.previousReq.qs.page_size)) ? this.previousReq.qs.page_size : 25;
                req.query({ page, 'page_size': pageSize });
                const res = yield this.client.do(req);
                if (!this.guard(res)) {
                    throw createFatalAPIFormat(req, res);
                }
                if (res.data.length === 0 || res.data.length < pageSize) {
                    this.done = true;
                }
                this.previousReq = req;
                return res;
            }))(),
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
exports.Paginator = Paginator;
function transformAPIResponse(r) {
    if (r.status === 204) {
        r.body = { data: null, meta: { status: 204, version: '', request_id: '' } };
    }
    if (r.status !== 204 && r.type !== exports.CONTENT_TYPE_JSON) {
        throw exports.ERROR_UNKNOWN_CONTENT_TYPE;
    }
    let j = r.body;
    if (!j.meta) {
        throw exports.ERROR_UNKNOWN_RESPONSE_FORMAT;
    }
    return j;
}
exports.transformAPIResponse = transformAPIResponse;
function createFatalAPIFormat(req, res) {
    return new errors_1.FatalException('API request was successful, but the response format was unrecognized.\n'
        + formatAPIResponse(req, res));
}
exports.createFatalAPIFormat = createFatalAPIFormat;
function formatSuperAgentError(e) {
    const res = e.response;
    const req = res.request;
    const statusCode = e.response.status;
    let f = '';
    try {
        const r = transformAPIResponse(res);
        f += formatAPIResponse(req, r);
    }
    catch (e) {
        f += `HTTP Error ${statusCode}: ${req.method.toUpperCase()} ${req.url}\n`;
        // TODO: do this only if verbose?
        f += '\n' + res.text ? res.text.substring(0, FORMAT_ERROR_BODY_MAX_LENGTH) : '<no buffered body>';
        if (res.text && res.text.length > FORMAT_ERROR_BODY_MAX_LENGTH) {
            f += ` ...\n\n[ truncated ${res.text.length - FORMAT_ERROR_BODY_MAX_LENGTH} characters ]`;
        }
    }
    return chalk.bold(chalk.red(f));
}
exports.formatSuperAgentError = formatSuperAgentError;
function formatAPIResponse(req, r) {
    if (guards_1.isAPIResponseSuccess(r)) {
        return formatAPISuccess(req, r);
    }
    else {
        return formatAPIError(req, r);
    }
}
exports.formatAPIResponse = formatAPIResponse;
function formatAPISuccess(req, r) {
    return `Request: ${req.method} ${req.url}\n`
        + `Response: ${r.meta.status}\n`
        + `Body: \n${util.inspect(r.data, { colors: chalk.enabled })}`;
}
exports.formatAPISuccess = formatAPISuccess;
function formatAPIError(req, r) {
    return `Request: ${req.method} ${req.url}\n`
        + `Response: ${r.meta.status}\n`
        + `Body: \n${util.inspect(r.error, { colors: chalk.enabled })}`;
}
exports.formatAPIError = formatAPIError;
