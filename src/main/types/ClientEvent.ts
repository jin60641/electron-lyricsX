import { Info } from '../../types';

export enum EventName {
  START = 'start',
  STOP = 'stop',
  PAUSE = 'pause',
  SEEK = 'seek',
  SET_PLAYER = 'setPlayer',
}

export enum Player {
  CHROME = 'Chrome',
  ITUNES = 'ITunes',
  CHROME_EXTENSION = 'ChromeExtension',
}

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
