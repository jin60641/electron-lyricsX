import {
  app, Menu, nativeImage, shell,
  Tray,
} from 'electron';
import path from 'path';

import { publicPath } from './constants';
import { Windows } from './windows';

let tray;
const createTray = (windows: Windows) => {
  const icon = nativeImage.createFromPath(path.join(publicPath, 'IconTemplate.png'));
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Toggle Lyrics',
      type: 'checkbox',
      checked: true,
      click: (menuItem) => {
        if (menuItem.checked) {
          windows.main.show();
        } else {
          windows.main.hide();
        }
      },
    },
    {
      label: 'Search Lyrics',
      click: () => {
        windows.search.show();
      },
    },
    { label: 'Lyrics Offset' },
    { type: 'separator' },
    {
      label: 'Preferences',
      click: () => {
        windows.preference.show();
      },
    },
    { type: 'separator' },
    {
      label: 'Learn More',
      click: async () => {
        await shell.openExternal('https://github.com/jin60641/electron-lyricsx');
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        Object.values(windows).forEach((window) => {
          window.setClosable(true);
          window.close();
        });
        app.quit();
      },
    },
  ]);
  tray.setToolTip('LyricsX');
  tray.setContextMenu(contextMenu);
};

export default createTray;
