import { Info, Music } from '../../types';

export interface LyricRequest {
  name: string;
  artist: string;
  duration: number;
}

export interface LyricResponse extends Omit<Music, 'lyric'> {
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
    [EventName.SET_PLAYER]: Player;
  };

  export type HandlersEventMap = {
    [Property in keyof DetailMap]: CustomEvent<DetailMap[Property]>;
  };
}
