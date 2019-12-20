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

    const key = core.getInput('gem-key', {required: false});
    const host = core.getInput('registry-url', {required: true});
    const username = core.getInput('username', {required: true});
    const password = core.getInput('password', {required: true});
    if ((password && username && host) || (key && password)) {
      core.setSecret(password);
      await configAuthentication({key, host, username, password});
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
