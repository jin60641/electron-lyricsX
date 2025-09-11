import { app, BrowserWindow, ipcMain, Event } from 'electron';
import { is } from '@electron-toolkit/utils';
import * as path from 'path';

import { setPlayer } from '../apis/index';
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
      preload: path.join(__dirname, '..', 'preload/index.js'),
    },
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#/preference/theme`);
  } else {
    win.loadURL(`file://${path.join(__dirname, '../renderer/index.html#/preference/theme')}`);
  }

  const handleClose = (e: null | Event) => {
    if (!isBeforeQuit) {
      e?.preventDefault();
      win.hide();
    }
  };

  win.setBackgroundColor('#00000000');

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
