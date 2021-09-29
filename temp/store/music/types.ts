export interface MusicState {
  list: Music[],
  count: number,
  lastCount: number,
  search: Search[],
  lastSelected?: number,
  isPlaying: boolean,
}

type Search = Pick<Music, 'lyric'>;

export enum Actions {
  SET_COUNT = 'MUSIC.SET_COUNT',
  SET_LAST_SELECTED = 'MUSIC.SET_LAST_SELECTED',

  START_MUSIC = 'MUSIC.START_MUSIC',
  STOP_MUSIC = 'MUSIC.STOP_MUSIC',
  PAUSE_MUSIC = 'MUSIC.PAUSE_MUSIC',
  SEEK_MUSIC = 'MUSIC.SEEK_MUSIC',

  SELECT_MUSIC = 'MUSIC.SELECT_MUSIC',
  RESET_MUSIC = 'MUSIC.RESET_MUSIC',
  REMOVE_MUSIC = 'MUSIC.REMOVE_MUSIC',
  SAVE_MUSIC = 'MUSIC.SAVE_MUSIC',

  SEARCH_MUSIC_REQUEST = 'MUSIC.SEARCH_MUSIC',
  SEARCH_MUSIC_SUCCESS = 'MUSIC.SEARCH_MUSIC#SUCCESS',
  SEARCH_MUSIC_FAILURE = 'MUSIC.SEARCH_MUSIC#FAILURE',
  RESET_SEARCH = 'MUSIC.RESET_SEARCH',

  OPEN_FINDER = 'MUSIC.OPEN_FINDER',
}

export const initialState: MusicState = {
  list: [],
  search: [],
  count: 0,
  lastCount: 0,
  isPlaying: false,
};

export interface Music {
  title?: string,
  artist?: string,
  duration?: number,
  position?: number,
  lyric?: string,
}
