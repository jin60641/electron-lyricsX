import { app } from 'electron';
import path from 'path';

export const isDev = !app.isPackaged
export const isMac = process.platform === 'darwin';
const appPath = app.getAppPath();
export const resourcePath = isDev ? appPath : process.resourcesPath;
export const dirPath = path.join(appPath, 'build', 'electron');
export const publicPath = path.join(resourcePath, 'public');
export const preloadPath = path.join(dirPath, 'preload', 'index.js');
