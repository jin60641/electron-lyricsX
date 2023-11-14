import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

import { setPlayer } from '../apis/index';
import { isDev } from '../constants';
import playback from '../playback';

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
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, '..', 'preload.js'),
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000/#/preference/theme');
  } else {
    win.loadURL(`file://${path.join(__dirname, '..', '..', 'index.html#/preference/theme')}`);
  }

  const handleClose = (e: Event) => {
    if (!isBeforeQuit) {
      e.preventDefault();
      win.hide();
    }
  };

  win.setBackgroundColor('#00000000');

  // electron type error
  // @ts-ignore
  win.on('close', handleClose);

  app.on('before-quit', () => {
    isBeforeQuit = true;
  });

  ipcMain.on('LAYOUT.CLOSE_PREFERENCE', () => {
    win.hide();
  });

  ipcMain.on('PREFERENCE.SET_PLAYER#REQUEST', (_event, player) => {
    playback.setPlayer(player);
    setPlayer(win, player);
  });

  return win;
};

export default preferenceWindow;
