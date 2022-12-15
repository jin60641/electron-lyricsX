import {
  Menu, nativeImage, shell, Tray,
} from 'electron';
import path from 'path';

import { resourcePath } from './constants';
import { Windows } from './windows';

let tray;
const createTray = (windows: Windows) => {
  const icon = nativeImage.createFromPath(path.join(resourcePath, 'public/IconTemplate.png'));
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Search Lyrics',
      click: () => {
        windows.search.show();
      },
    },
    {
      label: 'Lyrics Offset',
    },
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
    { role: 'quit' },
  ]);
  tray.setToolTip('LyricsX');
  tray.setContextMenu(contextMenu);
};

export default createTray;
