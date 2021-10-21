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

export enum EventName {
  START = 'start',
  STOP = 'stop',
  PAUSE = 'pause',
  SEEK = 'seek',
}

export namespace ClientEvent {
  export type DetailMap = {
    [EventName.START]: Info;
    [EventName.STOP]: Info;
    [EventName.PAUSE]: Info;
    [EventName.SEEK]: Info;
  };

  export type HandlersEventMap = {
    [Property in keyof DetailMap]: CustomEvent<DetailMap[Property]>;
  };
}
