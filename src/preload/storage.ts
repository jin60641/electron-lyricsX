import type { Storage } from './types';

import Store from 'electron-store';

export const store = new Store<Record<string, string>>();

const storage: Storage = {
  getItem: (key) =>
    new Promise((resolve) => {
      resolve(store.get(key));
    }),
  setItem: (key, value) =>
    new Promise((resolve) => {
      resolve(store.set(key, value));
    }),
  removeItem: (key) =>
    new Promise((resolve) => {
      resolve(store.delete(key));
    }),
};

export default storage;
