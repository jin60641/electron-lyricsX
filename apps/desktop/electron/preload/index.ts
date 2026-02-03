import {
  contextBridge,
  ipcRenderer,
} from 'electron';

import storage from './storage';

contextBridge.exposeInMainWorld('bridge', {
  storage,
  platform: process.platform,
  ipc: {
    send: (channel: string, data: any) => {
      ipcRenderer.send(channel, data);
    },
    receive: (channel: string, func: any) => {
      ipcRenderer.on(channel, (_event, ...args) => func(...args));
    },
  },
});

export {};
