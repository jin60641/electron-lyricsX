// eslint-disable-next-line import/no-named-default
import { default as _isDev } from 'electron-is-dev';
import path from 'path';

export const isDev = _isDev;
export const isMac = process.platform === 'darwin';
export const resourcePath = isDev ? path.join(__dirname, '../..') : process.resourcesPath;
export const publicPath = isDev ? path.join(resourcePath, 'public') : path.join(__dirname, '..');
