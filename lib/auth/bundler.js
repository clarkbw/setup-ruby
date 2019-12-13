"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
// only exported for tests
function generateBundlerEnv(host) {
    const url = new URL(host);
    const domain = url.hostname.toUpperCase();
    return `BUNDLE_${domain.replace(/\./g, '__')}`;
}
exports.generateBundlerEnv = generateBundlerEnv;
function default_1(key, host, username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        // env['BUNDLE_RUBYGEMS__PKG__GITHUB__COM'] = USERNAME:PASSWORD
        const env = generateBundlerEnv(host);
        console.log(`exporting bundler env ${env}`);
        // core.exportVariable(
        //   env,
        //   `${encodeURIComponent(username)}:${encodeURIComponent(password)}`
        // );
        core.exportVariable('BUNDLE_GEM__PUSH_KEY', key);
        core.exportVariable('RUBYGEMS_HOST', host);
    });
}
exports.default = default_1;
