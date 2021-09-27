import EventTarget from './event';
import { EventName, Info } from './types';

const { spawn } = require('child_process');
const path = require('path');

type DefaultCallback = (data: Info) => void;

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
              this.emit(EventName.PAUSE, this.prevTrack);
              this.prevTrack = undefined;
            }
            return;
          }
          if (track && !this.isPlaying) {
            this.isPlaying = true;
            this.emit(EventName.START, track);
          } else if (track && this.isPlaying) {
            if (this.prevTrack?.name !== data.name) {
              this.emit(EventName.PAUSE, this.prevTrack);
              this.emit(EventName.START, track);
            } else {
              this.emit(EventName.SEEK, track);
            }
          }
          this.prevTrack = track;
        }
      });
    }, 2000);
  }

  private runTransportScript(callback: DefaultCallback) {
    const scriptPath = this.isWindows
      ? path.join(__dirname, '..', 'scripts', 'windows', 'iTunes.js')
      // : path.join(__dirname, '..', 'scripts', 'mac', 'ITunesTransport.scpt');
      : path.join(__dirname, '..', 'scripts', 'mac', 'ChromeTransport.scpt');
    const scriptRunner = this.isWindows
      ? spawn('cscript', ['//Nologo', scriptPath])
      : spawn('osascript', [scriptPath]);
    scriptRunner.stdout.on('data', (data: any) => {
      let result;
      try {
        result = JSON.parse(data);
      } catch (e) {
        result = data;
      }
      if (callback) {
        callback(result);
      }
    });
  }

  currentTrack(callback: DefaultCallback) {
    this.runTransportScript(callback);
  }
}

const playBack = new Playback();
export default playBack;
