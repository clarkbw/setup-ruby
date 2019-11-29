"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as url from 'url';
const core = __importStar(require("@actions/core"));
// only exported for tests
function generateBundlerEnv(host) {
    const url = new URL(host);
    const domain = url.hostname.toUpperCase();
    return `BUNDLE_${domain.replace(/\./g, '__')}`;
}
exports.generateBundlerEnv = generateBundlerEnv;
function default_1(host, username, password) {
    // env['BUNDLE_RUBYGEMS__PKG__GITHUB__COM'] = USERNAME:PASSWORD
    const env = generateBundlerEnv(host);
    console.log(`exporting bundler env ${env}`);
    core.exportVariable(env, `${username}:${password}`);
}
exports.default = default_1;
