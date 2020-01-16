import io = require('@actions/io');
import fs = require('fs');
import os = require('os');
import path = require('path');

// make the os.homedir() call be local to the tests
jest.doMock('os', () => {
  return {
    homedir: jest.fn(() => __dirname)
  };
});

import * as auth from '../src/auth';
import * as gem from '../src/auth/gem';
import * as credentials from '../src/auth/gem/credentials';
import * as gemrc from '../src/auth/gem/gemrc';
import * as bundler from '../src/auth/bundler';
import * as cleanup from '../src/cleanup';

const GEMRC_FILE = path.join(__dirname, gem.GEMRC_DIR, gem.GEMRC_FILE);
const GEM_DIR = path.join(__dirname, gem.CREDENTIALS_DIR);
const CREDENTIALS_FILE = path.join(GEM_DIR, gem.CREDENTIALS_FILE);

describe('auth', () => {
  beforeEach(async () => {
    await io.rmRF(GEM_DIR);
    await io.rmRF(GEMRC_FILE);
  }, 300000);

  afterAll(async () => {
    try {
      await io.rmRF(GEM_DIR);
      await io.rmRF(GEMRC_FILE);
    } catch {
      console.log('Failed to remove test directories');
    }
  }, 100000);

  it(`it creates a ${gem.CREDENTIALS_FILE} file given gem parameters`, async () => {
    const host = 'https://rubygems.pkg.github.com/mona';
    const username = 'bluebottle';
    const password = 'SingleOrigin';
    const key = 'github';

    await auth.configAuthentication({key, host, username, password});

    function octalMode(stats: fs.Stats) {
      return stats.mode & parseInt('777', 8);
    }

    expect(fs.existsSync(GEM_DIR)).toBe(true);
    expect(fs.existsSync(CREDENTIALS_FILE)).toBe(true);
    expect(octalMode(fs.statSync(CREDENTIALS_FILE))).toEqual(0o600);
    expect(fs.readFileSync(CREDENTIALS_FILE, 'utf-8')).toEqual(
      credentials.generate(key, password)
    );
  }, 100000);

  it(`it creates a ${gem.GEMRC_FILE} file given gem parameters`, async () => {
    const host = 'https://rubygems.pkg.github.com/mona';
    const username = 'bluebottle';
    const password = 'SingleOrigin';
    const key = 'github';

    await auth.configAuthentication({key, host, username, password});

    expect(fs.existsSync(GEMRC_FILE)).toBe(true);
    expect(fs.readFileSync(GEMRC_FILE, 'utf-8')).toEqual(
      gemrc.generate(host, username, password)
    );
  }, 100000);

  it(`it exports environment variables for bundler`, () => {
    const host = 'https://rubygems.pkg.github.com/mona';
    const username = 'bluebottle';
    const password = 'SingleOrigin';
    const key = 'github';

    auth.configAuthentication({key, host, username, password});

    expect(process.env[bundler.generateBundlerEnv(host)]).toBe(
      `${username}:${password}`
    );
    expect(process.env[bundler.BUNDLE_GEM__PUSH_KEY]).toBe(key);
    expect(process.env[bundler.RUBYGEMS_HOST]).toBe(
      auth.authenticatedHost(username, password, host)
    );
  });

  describe('gem', () => {
    it(`sanity check the credentials format`, () => {
      const key = 'BEAR';
      const password = 'WOODS';
      const creds = `---\n:${key}: Bearer ${password}\n`;
      expect(credentials.generate(key, password)).toBe(creds);
    });
  });

  describe('bundler', () => {
    const envs = {
      'https://rubygems.pkg.github.com/mona':
        'BUNDLE_RUBYGEMS__PKG__GITHUB__COM',
      'http://rubygems.pkg.github.com/http_without-s':
        'BUNDLE_RUBYGEMS__PKG__GITHUB__COM',
      'https://r.u.b.y.g.e.m.s.example.com/periods':
        'BUNDLE_R__U__B__Y__G__E__M__S__EXAMPLE__COM',
      'http://github.com/path/with/depth': 'BUNDLE_GITHUB__COM'
    };

    it(`it generates the correct ENV`, () => {
      for (let [key, value] of Object.entries(envs)) {
        expect(bundler.generateBundlerEnv(key)).toBe(value);
      }
    });
  });

  describe('cleanup', () => {
    it(`deletes the auth directory `, async () => {
      const host = 'https://rubygems.pkg.github.com/mona';
      const username = 'bluebottle';
      const password = 'SingleOrigin';
      const key = 'github';

      await auth.configAuthentication({key, host, username, password});

      expect(fs.existsSync(GEM_DIR)).toBe(true);
      expect(fs.existsSync(CREDENTIALS_FILE)).toBe(true);
      expect(fs.existsSync(GEMRC_FILE)).toBe(true);

      await cleanup.run();

      expect(fs.existsSync(GEM_DIR)).toBe(false);
      expect(fs.existsSync(GEMRC_FILE)).toBe(false);
    });
  });
});
