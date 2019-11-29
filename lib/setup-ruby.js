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
const installer_1 = require("./installer");
const auth_1 = require("./auth");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let version = core.getInput('version');
            if (!version) {
                version = core.getInput('ruby-version');
            }
            yield installer_1.findRubyVersion(version);
            const gem = core.getInput('gem', { required: false });
            if (gem) {
                const key = core.getInput('key', { required: true });
                const password = core.getInput('password', { required: true });
                yield auth_1.configAuthentication({ key, password });
            }
            const bundler = core.getInput('bundler', { required: false });
            if (bundler) {
                const host = core.getInput('registry-url', { required: true });
                const username = core.getInput('username', { required: true });
                const password = core.getInput('password', { required: true });
                yield auth_1.configAuthentication({ host, username, password });
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
