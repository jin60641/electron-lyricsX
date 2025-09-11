import { is } from '@electron-toolkit/utils';
import path from 'path';

export const isDev = is.dev;
export const isMac = process.platform === 'darwin';
export const resourcePath = isDev ? path.join(__dirname, '../..') : process.resourcesPath;
export const publicPath = path.join(isDev ? resourcePath : path.join(__dirname, '..', '..'), 'resources');
