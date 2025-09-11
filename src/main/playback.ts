import { Info } from '../types';

import { resourcePath } from './constants';
import EventTarget from './event';
import { EventName, Player } from './types/ClientEvent';

import { spawn } from 'child_process';
import path from 'path';

const SCRIPT_DIR = path.join(resourcePath, 'scripts');

type DefaultCallback = (data: Info | null) => void;

class Playback extends EventTarget {
  private isWindows = !!process.platform.match(/^win/);

  private isPlaying: boolean = false;

  private prevTrack?: Info;

  private player?: Player;

  private timer?: ReturnType<typeof setInterval>;

  public handleData = (data: Info | string | null) => {
    if (data || this.isPlaying) {
      let track: Info | null;
      if (typeof data === 'string') {
        track = JSON.parse(data) as Info;
      } else {
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
        if (this.prevTrack) {
          this.isPlaying = true;
          if (this.prevTrack?.name !== track.name) {
            this.emit(EventName.START, track);
          } else if (track.position !== this.prevTrack.position) {
            this.emit(EventName.START);
          }
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

  constructor() {
    super();
    this.startTimer();
  }

  public startTimer() {
    if (this.timer) {
      return;
    }
    this.timer = setInterval(() => {
      this.runTransportScript(this.handleData);
    }, 1000);
  }

  public pauseTimer() {
    if (!this.timer) {
      return;
    }
    clearInterval(this.timer);
    this.timer = undefined;
  }

  public setPlayer(player: Player) {
    if (this.player === player) {
      return;
    }
    this.player = player;
    this.pauseTimer();
    if (this.prevTrack) {
      this.isPlaying = false;
      this.emit(EventName.STOP, this.prevTrack);
      this.prevTrack = undefined;
    }
    if (this.player !== Player.CHROME_EXTENSION) {
      this.startTimer();
    }
  }

  private runTransportScript(callback: DefaultCallback) {
    if (!callback || !this.player) {
      return;
    }
    const scriptPath = path.join(
      SCRIPT_DIR,
      this.isWindows ? 'windows' : 'mac',
      `${this.player}Transport.scpt`,
    );
    const process = this.isWindows
      ? spawn('powershell.exe', [scriptPath])
      : spawn('osascript', [scriptPath], { shell: true, detached: true });
    process.stdout.on('data', (result: string | Buffer) => {
      let data: Info | null = null;
      if (typeof result === 'string') {
        try {
          data = JSON.parse(result);
        } catch (_e) {
          data = result as unknown as Info;
        }
      } else if (result instanceof Buffer) {
        const parsed = new TextDecoder().decode(result).trim();
        try {
          data = JSON.parse(new TextDecoder().decode(result).trim());
        } catch (_e) {
          data = parsed as unknown as Info;
        }
      }
      if (data) {
        callback(data);
      }
    });
    process.on('error', () => {
      callback(null);
    });
  }
}

const playBack = new Playback();
export default playBack;
