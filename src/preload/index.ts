import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import type { Bridge } from './types';

import storage from './storage';

const bridge: Bridge = {
  storage,
  platform: process.platform,
  ipc: {
    send: (channel: string, data: unknown) => {
      ipcRenderer.send(channel, data);
    },
    receive: (channel: string, func: (...args: unknown[]) => void) => {
      ipcRenderer.on(channel, (_event, ...args) => func(...args));
    },
  },
};

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('electron', electronAPI);
  contextBridge.exposeInMainWorld('bridge', bridge);
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.bridge = bridge;
}

export {};
