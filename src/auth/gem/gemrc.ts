import {promises as fs} from 'fs';
import * as core from '@actions/core';
import * as os from 'os';
import * as path from 'path';

import {authenticatedHost} from '../';
import {GEMRC_FILE, GEMRC_DIR} from '.';

export default async function(
  host: string,
  username: string,
  password: string
) {
  const directory: string = path.join(os.homedir(), GEMRC_DIR);
  await fs.mkdir(directory, {recursive: true});
  console.log(`created directory ${directory}`);
  await write(directory, generate(host, username, password));
}

// only exported for testing purposes
export function generate(host: string, username: string, password: string) {
  return `---
:backtrace: false
:bulk_threshold: 1000
:sources:
- ${authenticatedHost(username, password, host)}
:update_sources: true
:verbose: true
`;
}

async function write(directory: string, credentials: string) {
  const options = {encoding: 'utf-8'};
  const location = path.join(directory, GEMRC_FILE);
  console.log(`writing ${location}`);
  await fs.writeFile(location, credentials, options);
}
