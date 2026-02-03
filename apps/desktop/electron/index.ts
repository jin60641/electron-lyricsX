import { app } from 'electron';
import { isMac } from './constants';

import createTray from './tray';
import createWindows from './windows';
import { registerStoreIpc } from './store';
import './server';

const close = () => null;
app.dock.hide();
app.on('window-all-closed', () => {
  close();
  app.quit();
});

app.on('before-quit', close);

app.on('will-quit', close);

app.whenReady().then(() => {
  registerStoreIpc();
  const windows = createWindows();
  createTray(windows);
  if (isMac) {
    app.dock.hide();
  }
});
