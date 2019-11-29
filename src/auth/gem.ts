import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as core from '@actions/core';
import * as io from '@actions/io';

export const GEM_DIR = '.gem';
export const CREDENTIALS_FILE = 'credentials';

export default async function(username: string, password: string) {
    const directory: string = path.join(os.homedir(), GEM_DIR);
    await io.mkdirP(directory);
    core.debug(`created directory ${directory}`);
    await write(directory, generate(username, password));
}

// only exported for testing purposes
// The username becomes the key to access this token via the `gem` command
// Example: gem push --key ${username} *.gem
export function generate(username: string, password: string) {
    return `---\n:${username}: Bearer ${password}\n`;
}

async function write(directory: string, credentials: string) {
    const options = {encoding: 'utf-8'};
    const location = path.join(directory, CREDENTIALS_FILE);
    console.log(`writing ${location}`);
    return fs.writeFileSync(location, credentials, options);
}
