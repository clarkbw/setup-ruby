import bundler from './bundler';
import gem from './gem';

interface GemBundlerParameters {
  readonly key?: string;
  readonly host?: string;
  readonly username?: string;
  readonly password: string;
}

// This supports 2 authentication methods for bundler and gem as they are the
// most common tools used for Ruby Gems
// Supplying a registry host, username and password supports both bundler and gem
// Not suppying a host name doesn't allow for bundler support
export async function configAuthentication(config: GemBundlerParameters) {
  if (config.key && config.host && config.username && config.password) {
    console.log(
      `configuring bundler for ${config.host} = ${config.username}:${config.password}`
    );
    await bundler(config.key, config.host, config.username, config.password);
  } else {
    console.log(
      `bundler configuration requires: key, host, username, and password`
    );
  }

  if (config.key && config.password) {
    console.log(`configuring gem with key: ${config.key}`);
    await gem(config.key, config.password);
  } else {
    console.log(`gem push authentication requires: key and password`);
  }
}
