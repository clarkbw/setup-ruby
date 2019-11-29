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
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const core = __importStar(require("@actions/core"));
const io = __importStar(require("@actions/io"));
exports.GEM_DIR = '.gem';
exports.CREDENTIALS_FILE = 'credentials';
function default_1(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const directory = path.join(os.homedir(), exports.GEM_DIR);
        yield io.mkdirP(directory);
        core.debug(`created directory ${directory}`);
        yield write(directory, generate(username, password));
    });
}
exports.default = default_1;
// only exported for testing purposes
// The username becomes the key to access this token via the `gem` command
// Example: gem push --key ${username} *.gem
function generate(username, password) {
    return `---\n:${username}: Bearer ${password}\n`;
}
exports.generate = generate;
function write(directory, credentials) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = { encoding: 'utf-8' };
        const location = path.join(directory, exports.CREDENTIALS_FILE);
        console.log(`writing ${location}`);
        return fs.writeFileSync(location, credentials, options);
    });
}
