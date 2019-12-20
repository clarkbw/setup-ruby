import {promises as fs} from 'fs';
import * as core from '@actions/core';
import * as os from 'os';
import * as path from 'path';

export const GEM_DIR = '.gem';
export const CREDENTIALS_FILE = 'credentials';
export const GEM_HOST_API_KEY = 'GEM_HOST_API_KEY';

export default async function(key: string, password: string) {
  const directory: string = path.join(os.homedir(), GEM_DIR);
  await fs.mkdir(directory, {recursive: true});
  core.debug(`created directory ${directory}`);
  await write(directory, generate(key, password));
  core.exportVariable(GEM_HOST_API_KEY, password);
  console.log(`export ${GEM_HOST_API_KEY}=${password}`);
}

// only exported for testing purposes
export function generate(key: string, password: string) {
  return `---\n:${key}: Bearer ${password}\n`;
}

async function write(directory: string, credentials: string) {
  const options = {encoding: 'utf-8', mode: 0o600};
  const location = path.join(directory, CREDENTIALS_FILE);
  console.log(`writing ${location}`);
  await fs.writeFile(location, credentials, options);
}
