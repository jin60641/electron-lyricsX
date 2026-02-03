import { ipcRenderer } from 'electron';

const storage = {
  getItem: (key: string) => ipcRenderer.invoke('electron-store-get', key),
  setItem: (key: string, item: unknown) => ipcRenderer.invoke('electron-store-set', key, item),
  removeItem: (key: string) => ipcRenderer.invoke('electron-store-delete', key),
};

export default storage;
