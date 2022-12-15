import { RootState } from '../types/root';

const Store = require('electron-store');

export const store = new Store();

type JsonObj = Record<string, Record<string, unknown>>;

const parseObj = (
  jsonObj: JsonObj,
  cnt: number,
): JsonObj => Object.entries(jsonObj)
  .reduce((obj, [key, value]) => ({
    ...obj,
    [`${key}`.replace('persist:', '')]: cnt ? parseObj(JSON.parse(`${value}`), cnt - 1) : value,
  }), {});


export const getStore = (): RootState | void => {
  try {
    return parseObj(store.store, 1) as unknown as RootState;
  } catch (e) {
    return;
  }
}

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
