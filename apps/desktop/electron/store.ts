import { ipcMain } from 'electron';
import Store from 'electron-store';

export const registerStoreIpc = () => {
  const store = new Store({ projectName: 'lyricsX' });

  ipcMain.handle('electron-store-get', (_event, key: string) => store.get(key));
  ipcMain.handle('electron-store-set', (_event, key: string, value: unknown) => {
    store.set(key, value);
    return null;
  });
  ipcMain.handle('electron-store-delete', (_event, key: string) => {
    store.delete(key);
    return null;
  });
};
