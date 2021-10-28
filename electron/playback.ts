import { Player } from '../src/store/preference/types';

import { isDev } from './constants';
import EventTarget from './event';
import { EventName, Info } from './types';

const { spawn } = require('child_process');
const path = require('path');

const SCRIPT_DIR = path.join(isDev ? path.join(__dirname, '..') : process.resourcesPath, 'scripts');

type DefaultCallback = (data: Info | null) => void;

// enum Player {
//   CHROME = 'Chrome',
//   ITUNES = 'ITunes',
//   CHROME_EXTENSION = 'ChromeExtension',
// }

class Playback extends EventTarget {
  private isWindows = !!process.platform.match(/^win/);

  private isPlaying: boolean = false;

  private prevTrack?: Info;

  private player: Player;

  public handleData = (data: Info | any) => {
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
        } else if (!this.prevTrack) {
          this.isPlaying = true;
          this.emit(EventName.START, track);
        }
      } else if (this.prevTrack?.name !== track.name) {
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
  };

  public setPlayer = (playerData: Player) => {
    this.player = playerData;
    if (this.player === Player.CHROME_EXTENSION) return;
    setInterval(() => {
      this.runTransportScript(this.handleData);
    }, 1000);
  };

  private runTransportScript(callback: DefaultCallback) {
    const scriptPath = path.join(SCRIPT_DIR, this.isWindows ? 'windows' : 'mac', `${this.player}Transport.scpt`);
    if (!callback) {
      return;
    }
    const process = this.isWindows
      ? spawn('powershell.exe', [scriptPath])
      : spawn('osascript', [scriptPath], { shell: true });
    process.stdout.on('data', (result: string | Buffer) => {
      let data: Info | null = null;
      if (typeof result === 'string') {
        try {
          data = JSON.parse(result);
        } catch (_e) {
          data = result as unknown as Info;
        }
      } else if (result instanceof Buffer) {
        const parsed = (new TextDecoder()).decode(result).trim();
        try {
          data = JSON.parse((new TextDecoder()).decode(result).trim());
        } catch (e) {
          data = parsed as unknown as Info;
        }
      }
      callback(data);
    });
    process.on('error', () => {
      callback(null);
    });
  }
}

const playBack = new Playback();
export default playBack;
