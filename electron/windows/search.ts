import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

import { searchMusic } from '../apis/index';
import { isDev } from '../constants';

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
      preload: path.join(__dirname, '..', 'preload.js'),
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000/#/Search');
  } else {
    win.loadURL(`file://${path.join(__dirname, '..', '..', 'index.html#/Search')}`);
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
  ipcMain.on('MUSIC.SEARCH_MUSIC#REQUEST', (_event, payload) => {
    searchMusic(win, payload);
  });
  return win;
};

export default searchWindow;
