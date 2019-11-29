import * as core from '@actions/core';
import bundler from './bundler';
import gem from './gem';

// This supports 2 authentication methods for bundler and gem as they are the 
// most common tools used for Ruby Gems
// Supplying a registry host, username and password supports both bundler and gem
// Not suppying a host name doesn't allow for bundler support
export async function configAuthentication(host: string, username: string, password: string) {
  if (host && username && password) {
    console.log(`configure bundler and gem support ${username}@${host} and password`);
    await bundler(host, username, password);
    await gem(username, password);
  } else if (username && password) {
    await gem(username, password);
  } else {
    core.debug(
      `no auth without username: ${username} and password: ${password}`
    );
  }
}
