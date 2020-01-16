import {promises as fs} from 'fs';
import * as core from '@actions/core';
import * as os from 'os';
import * as path from 'path';

import {CREDENTIALS_DIR, CREDENTIALS_FILE} from '.';

export default async function(key: string, password: string) {
  const directory: string = path.join(os.homedir(), CREDENTIALS_DIR);
  await fs.mkdir(directory, {recursive: true});
  console.log(`created directory ${directory}`);
  await write(directory, generate(key, password));
}

// only exported for testing purposes
export function generate(key: string, password: string) {
  return `---\n:${key}: Bearer ${password}\n`;
}

// export function generate(key: string, password: string) {
//   return `---\ndisable_default_gem_server: true\n`;
// }

async function write(directory: string, credentials: string) {
  const options = {encoding: 'utf-8', mode: 0o600};
  const location = path.join(directory, CREDENTIALS_FILE);
  console.log(`writing ${location}`);
  await fs.writeFile(location, credentials, options);
}
