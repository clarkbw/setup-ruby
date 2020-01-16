import * as core from '@actions/core';

import {authenticatedHost} from '.';

// This authentication does not work for publishing to GitHub Packages at the moment.
// Bundler strips the path from the host URL, attempting to publish to rubygems.pkg.github.com
// Therefore this command does not work: bundle exec rake release:rubygem_push
// However the settings provided here allow bundler to install packages from authenticated sources

export const RUBYGEMS_HOST = 'RUBYGEMS_HOST';
export const BUNDLE_GEM__PUSH_KEY = 'BUNDLE_GEM__PUSH_KEY';

// only exported for tests
export function generateBundlerEnv(host: string) {
  const url = new URL(host);
  const domain = url.hostname.toUpperCase();
  return `BUNDLE_${domain.replace(/\./g, '__')}`;
}

export default async function(
  key: string,
  host: string,
  username: string,
  password: string
) {
  // https://bundler.io/v1.16/bundle_config.html
  // env['BUNDLE_RUBYGEMS__PKG__GITHUB__COM'] = USERNAME:PASSWORD
  const env = generateBundlerEnv(host);
  core.exportVariable(env, `${username}:${password}`);
  console.log(`export ${env}=${username}:${password}`);

  // https://bundler.io/v1.16/bundle_config.html
  // sets the push key to use from ~/.gem/credentials
  core.exportVariable(BUNDLE_GEM__PUSH_KEY, key);
  console.log(`export ${BUNDLE_GEM__PUSH_KEY}=${key}`);

  // equivalent to the --host option when pushing
  const rubyGemsHost = authenticatedHost(username, password, host);
  core.exportVariable(RUBYGEMS_HOST, rubyGemsHost);
  console.log(`export ${RUBYGEMS_HOST}=${rubyGemsHost}`);
}
