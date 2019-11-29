import {promises as fs} from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as core from '@actions/core';

export const GEM_DIR = '.gem';
export const CREDENTIALS_FILE = 'credentials';

export default async function(key: string, password: string) {
  const directory: string = path.join(os.homedir(), GEM_DIR);
  await fs.mkdir(directory, {recursive: true});
  core.debug(`created directory ${directory}`);
  await write(directory, generate(key, password));
}

// only exported for testing purposes
export function generate(key: string, password: string) {
  return `---\n:${key}: Bearer ${password}\n`;
}

async function write(directory: string, credentials: string) {
  const options = {encoding: 'utf-8', mode: 0o600};
  const location = path.join(directory, CREDENTIALS_FILE);
  console.log(`writing ${location}`);
  return await fs.writeFile(location, credentials, options);
}
