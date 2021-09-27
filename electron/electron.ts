import {
  app,
  BrowserView,
  screen,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  shell,
} from 'electron';
import fetch from 'electron-fetch';
import * as isDev from 'electron-is-dev';
import * as fs from 'fs';
import * as path from 'path';

import {
  openPreference,
  pauseMusic,
  seekMusic,
  startMusic,
  stopMusic,
} from './apis/index';
import playback from './playback';
import { EventName } from './types';

const close = () => null;

const isMac = process.platform === 'darwin';

if(isMac) {
  app.dock.hide();
}
app.on('window-all-closed', () => {
  close();
  app.quit();
});

app.on('before-quit', close);

app.on('will-quit', close);

const createWindow = () => {
  // Create the browser window.
  const win = new BrowserWindow({
    transparent: true,
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
      preload: `${__dirname}/preload.js`,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');
    // caution: can't transparent if open devtools
    // win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../build/index.html'));
  }

  const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        {
          label: 'Preferences...',
          click: () => openPreference(win),
          accelerator: 'Command+,',
        },
      ],
    }] : []),
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' },
        ] : [
          { role: 'close' },
        ]),
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            await shell.openExternal('https://github.com/jin60641/lyrics');
          },
        },
      ],
    },
  ];

  win.setVisibleOnAllWorkspaces(true);
  win.setBackgroundColor('#00000000');

  ipcMain.on('LAYOUT.RESIZE_WINDOW', (_event, payload) => {
    const bounds = win.getBounds();
    const diff = {
      width: payload.width - bounds.width,
      height: payload.height - bounds.height,
    };
    const display = screen.getPrimaryDisplay().bounds;
    let x, y;
    if (bounds.x < 5) {
      x = bounds.x;
    } else if (display.width - 5 < bounds.x + bounds.width) {
      x = bounds.x + bounds.width - Math.round(payload.width)
    } else {
      x = Math.min(Math.max(0, bounds.x - Math.round(diff.width / 2)), display.width - Math.round(payload.width));
    }
    if (bounds.y < 5) {
      y = bounds.y;
    } else if (display.height - 5 < bounds.y + bounds.height) {
      y = bounds.y + bounds.height - Math.round(payload.height)
    } else {
      y = Math.min(Math.max(0, bounds.y - Math.round(diff.height / 2)), display.height - Math.round(payload.height));
    }
    win.setBounds({
      x,
      y,
      width: Math.round(payload.width),
      height: Math.round(payload.height),
    });
  });

  const menu = Menu.buildFromTemplate(template as MenuItemConstructorOptions[]);
  Menu.setApplicationMenu(menu);

  playback.on(EventName.START, ({ detail }) => { startMusic(win, detail); });
  playback.on(EventName.STOP, () => { stopMusic(win); });
  playback.on(EventName.PAUSE, () => { pauseMusic(win); });
  playback.on(EventName.SEEK, ({ detail }) => { seekMusic(win, detail); });
};

app.whenReady().then(createWindow);
