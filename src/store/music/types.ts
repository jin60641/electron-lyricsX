import { Row } from '../../types/lyric';

export interface MusicState {
  list: Music[],
  searchList: Music[],
  searchIndex: number,
  lastSelected?: number,
  isPlaying: boolean,
  currentOffset: number,
  globalOffset: number,
  name?: string,
  artist?: string,
}

export enum Actions {
  START_MUSIC = 'MUSIC.START_MUSIC',
  STOP_MUSIC = 'MUSIC.STOP_MUSIC',
  PAUSE_MUSIC = 'MUSIC.PAUSE_MUSIC',
  SEEK_MUSIC = 'MUSIC.SEEK_MUSIC',
  SEARCH_MUSIC_REQUEST = 'MUSIC.SEARCH_MUSIC#REQUEST',
  SEARCH_MUSIC_SUCCESS = 'MUSIC.SEARCH_MUSIC#SUCCESS',
  SEARCH_MUSIC_FAILURE = 'MUSIC.SEARCH_MUSIC#FAILURE',
  SET_SEARCH_INDEX = 'MUSIC.SET_SEARCH_INDEX',

  SELECT_MUSIC = 'MUSIC.SELECT_MUSIC',
  RESET_MUSIC = 'MUSIC.RESET_MUSIC',
  REMOVE_MUSIC = 'MUSIC.REMOVE_MUSIC',

  SET_CURRENT_OFFSET = 'MUSIC.SET_CURRENT_OFFSET',
  SET_GLOBAL_OFFSET = 'MUSIC.SET_GLOBAL_OFFSET',
}

export const initialState: MusicState = {
  list: [],
  searchList: [],
  searchIndex: 0,
  isPlaying: false,
  currentOffset: 0,
  globalOffset: -0.5,
};

export interface Music {
  duartion?: string,
  name?: string,
  artist?: string,
  position?: number,
  source?: string,
  lyric?: Row[],
}

export type SearchMusicRequestPayload = Pick<Music, 'name' | 'artist' | 'duartion'>;
export type SearchMusicSuccessPayload = MusicState['searchList'];

export type StartMusicPayload = Pick<MusicState, 'name' | 'artist'>;
