import * as core from '@actions/core';
import {findRubyVersion} from './installer';
import { configAuthentication } from './auth';

async function run() {
  try {
    let version = core.getInput('version');
    if (!version) {
      version = core.getInput('ruby-version');
    }
    await findRubyVersion(version);

    const registry = core.getInput('registry-url', {required: false});
    const key = core.getInput('key', {required: false});
    const username = core.getInput('username', {required: false});
    const password = core.getInput('password', {required: false});

    await configAuthentication(registry, username, password);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
