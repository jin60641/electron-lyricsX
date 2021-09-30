import { app, BrowserWindow } from 'electron';
import * as path from 'path';

import { isDev } from '../constants';

const preferenceWindow = () => {
  let isBeforeQuit = false;
  const win = new BrowserWindow({
    show: false,
    frame: false,
    resizable: false,
    maximizable: false,
    minimizable: false,
    width: 800,
    height: 700,
    
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, '..', 'preload.js'),
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000/#/preference/theme');
  } else {
    win.loadFile(path.join(__dirname, '..', '..', 'build', 'index.html#/preference/theme'));
  }

  const handleClose = (e: Event) => {
    if (!isBeforeQuit) {
      e.preventDefault();
      win.hide();
    }
  };

  win.setBackgroundColor('#00000000');

  win.on('close', handleClose);

  app.on('before-quit', () => {
    isBeforeQuit = true;
  });

  return win;
};

export default preferenceWindow;
