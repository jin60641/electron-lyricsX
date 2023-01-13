import { Music } from '../../types/lyric';

export interface MusicState {
  list: Music[],
  lastSelected: number,
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
  SET_LAST_SELECTED = 'MUSIC.SET_LAST_SELECTED',

  RESET_MUSIC = 'MUSIC.RESET_MUSIC',
  REMOVE_MUSIC = 'MUSIC.REMOVE_MUSIC',

  SET_CURRENT_OFFSET = 'MUSIC.SET_CURRENT_OFFSET',
  SET_GLOBAL_OFFSET = 'MUSIC.SET_GLOBAL_OFFSET',

  TRANSLATE_LYRIC_REQUEST = 'MUSIC.TRANSLATE_LYRIC#REQUEST',
  TRANSLATE_LYRIC_SUCCESS = 'MUSIC.TRANSLATE_LYRIC#SUCCESS',
  TRANSLATE_LYRIC_FAILURE = 'MUSIC.TRANSLATE_LYRIC#FAILURE',
}

export const initialState: MusicState = {
  list: [],
  lastSelected: 0,
  isPlaying: false,
  currentOffset: 0,
  globalOffset: -0.5,
};

export interface TranslateLyricRequestPayload {
  lyric: Music['lyric'],
  locale: string;
}

export type SearchMusicRequestPayload = Pick<Music, 'name' | 'artist'>;
export type SearchMusicSuccessPayload = MusicState['list'];

export type StartMusicPayload = SearchMusicRequestPayload;
