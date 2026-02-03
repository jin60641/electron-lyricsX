import {
  contextBridge,
  ipcRenderer,
} from 'electron';

import storage from './storage';

contextBridge.exposeInMainWorld('bridge', {
  storage,
  platform: process.platform,
  ipc: {
    send: (channel: string, data: unknown) => {
      ipcRenderer.send(channel, data);
    },
    receive: (channel: string, func: (...args: unknown[]) => void) => {
      ipcRenderer.on(channel, (_event, ...args: unknown[]) => func(...args));
    },
  },
});

export {};
