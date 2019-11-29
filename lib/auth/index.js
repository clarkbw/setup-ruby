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
function configAuthentication(host, username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (host && username && password) {
            console.log(`configure bundler and gem support ${username}@${host} and password`);
            yield bundler_1.default(host, username, password);
            yield gem_1.default(username, password);
        }
        else if (username && password) {
            yield gem_1.default(username, password);
        }
        else {
            core.debug(`no auth without username: ${username} and password: ${password}`);
        }
    });
}
exports.configAuthentication = configAuthentication;
