import { ElectronAPI } from '@electron-toolkit/preload';
import { Bridge } from './types';

declare global {
  interface Window {
    electron: ElectronAPI;
    bridge: Bridge;
  }
}
