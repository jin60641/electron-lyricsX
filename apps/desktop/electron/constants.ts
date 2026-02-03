import { app } from 'electron';
import path from 'path';

export const isDev = !app.isPackaged
export const isMac = process.platform === 'darwin';
export const resourcePath = isDev ? path.join(__dirname, '..', '..') : process.resourcesPath;
export const dirPath = isDev ? __dirname : path.join(resourcePath, 'app', 'build','electron');
export const publicPath = path.join(resourcePath, 'public');
export const preloadPath = path.join(dirPath, 'preload', 'index.js');
