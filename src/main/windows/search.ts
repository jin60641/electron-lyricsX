import { app, shell, BrowserWindow, Event, ipcMain } from 'electron';
import * as path from 'path';
import { is } from '@electron-toolkit/utils';

import { searchMusic } from '../apis/index';

const searchWindow = () => {
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
      preload: path.join(__dirname, '../preload/index.js'),
    },
  });

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#/Search`);
  } else {
    win.loadURL(`file://${path.join(__dirname, '../renderer/index.html#/Search')}`);
  }

  const handleClose = (e: Event | null) => {
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
  ipcMain.on('MUSIC.SEARCH_MUSIC#REQUEST', (_event, payload) => {
    searchMusic(win, payload);
  });
  return win;
};

export default searchWindow;
