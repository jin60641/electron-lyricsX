import { app } from 'electron';
import { optimizer } from '@electron-toolkit/utils';
import { electronApp } from '@electron-toolkit/utils';

import { isMac } from './constants';
import createTray from './tray';
import createWindows from './windows';
import './server';

const close = () => null;
app.dock?.hide();
app.on('window-all-closed', () => {
  close();
  app.quit();
});

app.on('before-quit', close);

app.on('will-quit', close);

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');

  const windows = createWindows();
  createTray(windows);
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });
  if (isMac) {
    app.dock?.hide();
  }
});
