import { v4 as uuid } from 'uuid';

export interface MusicState {
  list: Music[],
  lastSelected?: number,
  isPlaying: boolean,
  currentOffset: number,
  globalOffset: number,
}

export enum Actions {
  SET_LAST_SELECTED = 'MUSIC.SET_LAST_SELECTED',

  START_MUSIC = 'MUSIC.START_MUSIC',
  STOP_MUSIC = 'MUSIC.STOP_MUSIC',
  PAUSE_MUSIC = 'MUSIC.PAUSE_MUSIC',
  SEEK_MUSIC = 'MUSIC.SEEK_MUSIC',

  SELECT_MUSIC = 'MUSIC.SELECT_MUSIC',
  RESET_MUSIC = 'MUSIC.RESET_MUSIC',
  REMOVE_MUSIC = 'MUSIC.REMOVE_MUSIC',

  SET_CURRENT_OFFSET = 'MUSIC.SET_CURRENT_OFFSET',
  SET_GLOBAL_OFFSET = 'MUSIC.SET_GLOBAL_OFFSET',
}

export const initialState: MusicState = {
  list: [],
  isPlaying: false,
  currentOffset: 0,
  globalOffset: 0.5,
};

export interface Music {
  title?: string,
  artist?: string,
  duration?: number,
  position?: number,
  lyric?: Row[],
}

interface Row {
  timestamp: string,
  time: number,
  text: string,
  id: ReturnType<typeof uuid>,
}
