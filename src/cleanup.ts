import * as os from 'os';
import {join} from 'path';
import {rmRF} from '@actions/io';
import {debug} from '@actions/core';
import {GEM_DIR} from './auth/gem';

export async function run() {
  const directory: string = join(os.homedir(), GEM_DIR);
  await rmRF(directory);
  debug(`cleanup: removing directory ${directory}`);
}

run();
