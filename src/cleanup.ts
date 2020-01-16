import * as os from 'os';
import {join} from 'path';
import {rmRF} from '@actions/io';
import {debug} from '@actions/core';
import {GEMRC_FILE, CREDENTIALS_DIR} from './auth/gem';

export async function run() {
  const directory: string = join(os.homedir(), CREDENTIALS_DIR);
  await rmRF(directory);
  console.log(`cleanup: removing directory ${directory}`);

  const file: string = join(os.homedir(), GEMRC_FILE);
  await rmRF(file);
  console.log(`cleanup: removing file ${file}`);
}

run();
