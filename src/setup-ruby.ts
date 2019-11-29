import * as core from '@actions/core';
import {findRubyVersion} from './installer';
import {configAuthentication} from './auth';

async function run() {
  try {
    let version = core.getInput('version');
    if (!version) {
      version = core.getInput('ruby-version');
    }
    await findRubyVersion(version);

    const gem = core.getInput('gem', {required: false});
    if (gem) {
      const key = core.getInput('key', {required: true});
      const password = core.getInput('password', {required: true});
      await configAuthentication({key, password});
    }

    const bundler = core.getInput('bundler', {required: false});
    if (bundler) {
      const host = core.getInput('registry-url', {required: true});
      const username = core.getInput('username', {required: true});
      const password = core.getInput('password', {required: true});
      await configAuthentication({host, username, password});
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
