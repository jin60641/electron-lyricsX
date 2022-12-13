import { BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';

import {
  pauseMusic, seekMusic, startMusic, stopMusic,
} from '../apis/index';
import { isDev } from '../constants';
import playback from '../playback';
import { EventName } from '../types';
import '../utils/polyfill';

const createWindow = () => {
  // Create the browser window.
  const win = new BrowserWindow({
    transparent: true,
    show: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    maximizable: false,
    minimizable: false,
    width: 300,
    height: 60,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      nativeWindowOpen: true,
      preload: path.join(__dirname, '..', 'preload.js'),
    },
  });

  if (isDev) {
    // caution: can't transparent if open devtools
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(path.join(__dirname, '../../build/index.html'));
  }

  win.setVisibleOnAllWorkspaces(true);
  win.setBackgroundColor('#00000000');

  ipcMain.on('LAYOUT.RESIZE_WINDOW', (_event, payload) => {
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

  ipcMain.on('LAYOUT.CHANGE_DRAGGABLE', (_event, payload) => {
    const { draggable } = payload;
    if (draggable) win.setIgnoreMouseEvents(false);
    else win.setIgnoreMouseEvents(true);
  });

  playback.on(EventName.START, ({ detail }) => {
    win.show();
    startMusic(win, detail);
  });
  playback.on(EventName.STOP, () => {
    stopMusic(win);
    // win.hide();
  });
  playback.on(EventName.PAUSE, () => { pauseMusic(win); });
  playback.on(EventName.SEEK, ({ detail }) => { seekMusic(win, detail); });

  return win;
};

export default createWindow;
