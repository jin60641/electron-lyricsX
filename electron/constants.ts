// eslint-disable-next-line import/no-named-default
import { default as _isDev } from 'electron-is-dev';

export const isDev = _isDev;
export const isMac = process.platform === 'darwin';
