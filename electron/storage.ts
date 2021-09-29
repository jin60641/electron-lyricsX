const Store = require('electron-store');

const store = new Store();

const storage = {
  getItem: (key: string) => new Promise((resolve) => {
    resolve(store.get(key));
  }),
  setItem: (key: string, item: any) => new Promise((resolve) => {
    resolve(store.set(key, item));
  }),
  removeItem: (key: string) => new Promise((resolve) => {
    resolve(store.delete(key));
  }),
};

export default storage;
