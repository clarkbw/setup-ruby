import * as core from '@actions/core';

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

// only exported for tests
export function authenticatedHost(
  username: string,
  password: string,
  host: string
) {
  const url = new URL(host);
  url.username = username;
  url.password = password;
  console.log(`url: ${url.href}`);
  return url.href;
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
  const encodedUsernamePassword = `${encodeURIComponent(
    username
  )}:${encodeURIComponent(password)}`;
  core.exportVariable(env, encodedUsernamePassword);
  console.log(`export ${env}=${encodedUsernamePassword}`);

  core.exportVariable(BUNDLE_GEM__PUSH_KEY, key);
  console.log(`export ${BUNDLE_GEM__PUSH_KEY}=${key}`);

  const rubyGemsHost = authenticatedHost(username, password, host);
  core.exportVariable(RUBYGEMS_HOST, host);
  console.log(`export ${RUBYGEMS_HOST}=${host}`);
}
