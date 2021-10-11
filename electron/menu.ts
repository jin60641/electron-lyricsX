import {
  app,
  Menu,
  MenuItemConstructorOptions,
  shell,
} from 'electron';

import { isMac } from './constants';
import { Windows } from './windows';

const createTemplate = (windows: Windows) => ([
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      {
        label: 'Preferences...',
        click: () => {
          windows.preference.show();
        },
        accelerator: 'Command+,',
      },
    ],
  }] : []),
  // { role: 'viewMenu' }
  {
    label: 'Search',
    submenu: [
      {
        label: 'Search Lyrics',
        click: () => {
          windows.search.show();
        },
      },
    ],
  },
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
] as MenuItemConstructorOptions[]);

const createMenu = (windows: Windows) => {
  const menu = Menu.buildFromTemplate(createTemplate(windows));
  Menu.setApplicationMenu(menu);
};

export default createMenu;
