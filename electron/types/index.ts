export interface Info {
  name: string;
  artist: string;
  album: string;
  duration: number;
  position: number;
  start: number
  finish: number
}

export interface LyricRequest {
  name: string;
  artist: string;
}

export interface LyricResponse {
  id: string | number;
  name: string;
  artist: string;
  lyric: string;
}

export enum Player {
  CHROME = 'Chrome',
  ITUNES = 'ITunes',
  CHROME_EXTENSION = 'ChromeExtension',
}

export enum EventName {
  START = 'start',
  STOP = 'stop',
  PAUSE = 'pause',
  SEEK = 'seek',
  SET_PLAYER = 'setPlayer',
}

export namespace ClientEvent {
  export type DetailMap = {
    [EventName.START]: Info;
    [EventName.STOP]: Info;
    [EventName.PAUSE]: Info;
    [EventName.SEEK]: Info;
    [EventName.SET_PLAYER]: any;
  };

  export type HandlersEventMap = {
    [Property in keyof DetailMap]: CustomEvent<DetailMap[Property]>;
  };
}
