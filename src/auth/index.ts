import * as core from '@actions/core';

import bundler from './bundler';
import gem from './gem';

export const GEM_HOST_API_KEY = 'GEM_HOST_API_KEY';

interface GemBundlerParameters {
  readonly key?: string;
  readonly host?: string;
  readonly username?: string;
  readonly password: string;
}

// This supports 2 authentication methods for bundler and gem as they are the
// most common tools used for Ruby Gems
export async function configAuthentication(config: GemBundlerParameters) {
  if (config.password) {
    // sets the password for push, this overrides the --key command line option
    // confusing that https://github.com/rubygems/rubygems/blob/master/lib/rubygems/commands/push_command.rb#L132
    // would indicate this needs to use the same `Bearer: ${password}` syntax
    core.exportVariable(GEM_HOST_API_KEY, `Bearer ${config.password}`);
    console.log(`export ${GEM_HOST_API_KEY}='Bearer ${config.password}'`);
  }

  if (config.key && config.host && config.username && config.password) {
    console.log(
      `configuring bundler for ${config.host} = ${config.username}:${config.password}`
    );
    await bundler(config.key, config.host, config.username, config.password);

    console.log(`configuring gem with key: ${config.key}`);
    await gem(config.key, config.host, config.username, config.password);
  } else {
    console.log(`all parameters are required: key, host, username, password`);
  }
}

export function authenticatedHost(
  username: string,
  password: string,
  host: string
) {
  const url = new URL(host);
  url.username = username;
  url.password = password;
  console.log(`authenticated URL: ${url.href}`);
  return url.href;
}
