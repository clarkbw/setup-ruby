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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const bundler_1 = __importDefault(require("./bundler"));
const gem_1 = __importDefault(require("./gem"));
// This supports 2 authentication methods for bundler and gem as they are the
// most common tools used for Ruby Gems
// Supplying a registry host, username and password supports both bundler and gem
// Not suppying a host name doesn't allow for bundler support
function configAuthentication(config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (config.key && config.host && config.username && config.password) {
            console.log(`configuring bundler for ${config.host} = ${config.username}: a password`);
            yield bundler_1.default(config.key, config.host, config.username, config.password);
        }
        else {
            core.debug(`bundler cannot configured without the host, username, and password`);
        }
        if (config.key && config.password) {
            console.log(`configuring gem for ${config.key} and a password`);
            yield gem_1.default(config.key, config.password);
        }
        else {
            core.debug(`gem cannot be configured without the key and password`);
        }
    });
}
exports.configAuthentication = configAuthentication;
