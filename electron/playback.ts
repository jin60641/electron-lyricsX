import * as isDev from 'electron-is-dev';
import { promises as fs } from 'fs';

import EventTarget from './event';
import { EventName, Info } from './types';

const { spawnSync } = require('child_process');
const path = require('path');

const SCRIPT_DIR = path.join(isDev ? path.join(__dirname, '..') : process.resourcesPath, 'scripts');

type DefaultCallback = (data: Info | null) => void;

class Playback extends EventTarget {
  private isWindows = !!process.platform.match(/^win/);

  private isPlaying: boolean = false;

  private prevTrack?: Info;

  constructor() {
    super();
    setInterval(() => {
      this.runTransportScript((data: Info | any) => {
        if (data || this.isPlaying) {
          let track: Info;
          try {
            track = JSON.parse(data) as Info;
          } catch (e) {
            track = data;
          }
          if (!track) {
            if (this.isPlaying) {
              this.isPlaying = false;
              this.emit(EventName.STOP, this.prevTrack);
              this.prevTrack = undefined;
            }
            return;
          }
          if (!this.isPlaying) {
            if (this.prevTrack && track.position !== this.prevTrack.position) {
              this.isPlaying = true;
              this.emit(EventName.START, track);
            }
          } else if (this.prevTrack?.name !== data.name) {
            this.emit(EventName.STOP, this.prevTrack);
            this.emit(EventName.START, track);
          } else if (this.prevTrack && track.position === this.prevTrack.position) {
            this.isPlaying = false;
            this.emit(EventName.PAUSE, track);
          } else {
            this.emit(EventName.SEEK, track);
          }
          this.prevTrack = track;
        } else {
          this.emit(EventName.STOP, this.prevTrack);
        }
      });
    }, 1000);
  }

  private runTransportScript(callback: DefaultCallback) {
    const scriptPath = this.isWindows
      ? path.join(SCRIPT_DIR, 'windows', 'iTunes.js')
      // : path.join(SCRIPT_DIR, 'mac', 'ITunesTransport.scpt');
      : path.join(SCRIPT_DIR, 'mac', 'ChromeTransport.scpt');
    if (!callback) {
      return;
    }
    try {
      const result = this.isWindows
        ? spawnSync('cscript', ['//Nologo', scriptPath])
        : spawnSync('osascript', [scriptPath], { shell: true });
      let data: Info | null = null;
      if (typeof result.stdout === 'string') {
        try {
          data = JSON.parse(result.stdout);
        } catch (_e) {
          data = result.stdout;
        }
      } else if (result.stdout instanceof Buffer) {
        const parsed = (new TextDecoder()).decode(result.stdout).trim();
        try {
          data = JSON.parse((new TextDecoder()).decode(result.stdout).trim());
        } catch (e) {
          data = parsed as unknown as Info;
        }
      }
      callback(data);
    } catch (e) {
      callback(null);
    }
  }

  currentTrack(callback: DefaultCallback) {
    this.runTransportScript(callback);
  }
}

const playBack = new Playback();
export default playBack;
