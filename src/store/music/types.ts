import { v4 as uuid } from 'uuid';

export interface MusicState {
  list: Music[],
  lastSelected?: number,
  isPlaying: boolean,
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
}

export const initialState: MusicState = {
  list: [],
  isPlaying: false,
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
