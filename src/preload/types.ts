export interface IpcAPI {
  send: (channel: string, data: unknown) => void;
  receive: (channel: string, callback: (...args: unknown[]) => void) => void;
}

export interface Storage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export interface Bridge {
  storage: Storage;
  platform: typeof process.platform;
  ipc: IpcAPI;
}
