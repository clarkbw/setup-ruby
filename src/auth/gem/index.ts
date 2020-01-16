import gemrc from './gemrc';
import credentials from './credentials';

export const GEMRC_DIR = '.';
export const GEMRC_FILE = '.gemrc';

export const CREDENTIALS_DIR = '.gem/';
export const CREDENTIALS_FILE = 'credentials';

export default async function(
  key: string,
  host: string,
  username: string,
  password: string
) {
  await gemrc(host, username, password);
  await credentials(key, password);
}
