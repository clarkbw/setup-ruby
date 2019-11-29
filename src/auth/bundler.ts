// import * as url from 'url';
import * as core from '@actions/core';

// only exported for tests
export function generateBundlerEnv(host: string) {
  const url = new URL(host);
  const domain = url.hostname.toUpperCase();
  return `BUNDLE_${domain.replace(/\./g, '__')}`;
}

export default function(host: string, username: string, password: string) {
  // env['BUNDLE_RUBYGEMS__PKG__GITHUB__COM'] = USERNAME:PASSWORD
  const env = generateBundlerEnv(host);
  console.log(`exporting bundler env ${env}`);
  core.exportVariable(env, `${username}:${password}`);
}
