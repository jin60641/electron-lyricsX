import { app } from 'electron';

import { isMac } from './constants';
import createMenu from './menu';
import createWindows from './windows';
import './server';

const close = () => null;

if (isMac) {
  app.dock.hide();
}

app.on('window-all-closed', () => {
  close();
  app.quit();
});

app.on('before-quit', close);

app.on('will-quit', close);

app.whenReady().then(() => {
  createMenu(createWindows());
});
