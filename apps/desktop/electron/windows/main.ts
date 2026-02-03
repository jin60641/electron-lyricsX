import {
  BrowserWindow,
  shell,
  ipcMain,
  screen,
  type IpcMainEvent,
} from 'electron';
import * as path from 'path';

import { Music } from '@repo/types';
import { layoutActions, musicActions } from '@repo/state';
import {
  pauseMusic, seekMusic, sendTranslatedLyric, startMusic,
  stopMusic,
} from '../apis/index';
import { isDev, dirPath, preloadPath } from '../constants';
import playback from '../playback';
import { EventName } from '../types';
import '../utils/polyfill';
import { tlitLyric } from '../utils/parse';

const createWindow = () => {
  // Create the browser window.
  const win = new BrowserWindow({
    transparent: true,
    show: false,
    frame: false,
    resizable: false,
    closable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    maximizable: false,
    minimizable: false,
    width: 300,
    height: 60,
    minHeight: 1,
    minWidth: 1,
    hasShadow: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: true,
      preload: preloadPath,
      sandbox: false,
    },
  });

 win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (isDev) {
    // caution: can't transparent if open devtools
    win.loadURL('http://localhost:3000');
  } else {
    win.loadURL(`file://${path.join(dirPath, '../index.html')}`);
  }
  win.setMenu(null);
  win.setVisibleOnAllWorkspaces(true);

  ipcMain.on(layoutActions.resizeWindow.type, (_event, payload) => {
    const bounds = win.getBounds();
    const diff = {
      width: payload.width - bounds.width,
      height: payload.height - bounds.height,
    };
    const display = screen.getPrimaryDisplay().bounds;
    let x; let
      y;
    if (bounds.x < 5) {
      x = bounds.x;
    } else if (display.width - 5 < bounds.x + bounds.width) {
      x = bounds.x + bounds.width - Math.round(payload.width);
    } else {
      x = Math.min(
        Math.max(0, bounds.x - Math.round(diff.width / 2)),
        display.width - Math.round(payload.width),
      );
    }
    if (bounds.y < 5) {
      y = bounds.y;
    } else if (display.height - 5 < bounds.y + bounds.height) {
      y = bounds.y + bounds.height - Math.round(payload.height);
    } else {
      y = Math.min(
        Math.max(0, bounds.y - Math.round(diff.height / 2)),
        display.height - Math.round(payload.height),
      );
    }
    const nextBounds = {
      x,
      y,
      width: Math.round(payload.width),
      height: Math.round(payload.height),
    };
    win.setBounds(nextBounds, true);
  });

  ipcMain.on(layoutActions.changeDraggable.type, (_event, payload) => {
    const { draggable } = payload;
    if (draggable) win.setIgnoreMouseEvents(false);
    else win.setIgnoreMouseEvents(true);
  });

  ipcMain.on(
    musicActions.translateLyric.request.type,
    async (event: IpcMainEvent, payload: { lyric: Music['lyric'], locale: string }) => {
      if (BrowserWindow.fromWebContents(event.sender) !== win) {
        return;
      }
      const lyricWithTlit = await tlitLyric(payload);
      sendTranslatedLyric(win, lyricWithTlit);
    },
  );

  playback.on(EventName.START, ({ detail }) => {
    win.showInactive();
    startMusic(win, detail);
  });
  playback.on(EventName.STOP, () => {
    stopMusic(win);
    win.hide();
  });
  playback.on(EventName.PAUSE, () => { pauseMusic(win); });
  playback.on(EventName.SEEK, ({ detail }) => { seekMusic(win, detail); });

  return win;
};

export default createWindow;
