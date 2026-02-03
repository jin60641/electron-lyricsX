import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { Info, Music } from '@repo/types';

export interface MusicState {
  list: Music[];
  lastSelected: number;
  isPlaying: boolean;
  currentOffset: number;
  globalOffset: number;
  name?: string;
  artist?: string;
}

export const musicInitialState: MusicState = {
  list: [],
  lastSelected: 0,
  isPlaying: false,
  currentOffset: 0,
  globalOffset: -0.5,
};

export interface TranslateLyricRequestPayload {
  lyric: Music['lyric'];
  locale: string;
}

export type SearchMusicRequestPayload = Pick<Music, 'name' | 'artist'>;
export type SearchMusicSuccessPayload = MusicState['list'];
export type StartMusicPayload = SearchMusicRequestPayload;

const musicSlice = createSlice({
  name: 'music',
  initialState: musicInitialState,
  reducers: {
    resetMusic: (state) => {
      state.list = [];
    },
    startMusic: (state, action: PayloadAction<StartMusicPayload>) => {
      Object.assign(state, action.payload);
      state.isPlaying = true;
    },
    stopMusic: () => ({ ...musicInitialState, list: [] }),
    pauseMusic: (state) => {
      state.isPlaying = false;
    },
    seekMusic: (state, action: PayloadAction<Info>) => {
      void action.payload;
      return state;
    },
    searchMusicRequest: (state, action: PayloadAction<SearchMusicRequestPayload>) => {
      void action.payload;
      return state;
    },
    searchMusicSuccess: (state, action: PayloadAction<SearchMusicSuccessPayload>) => {
      state.list = action.payload;
    },
    searchMusicFailure: (state, action: PayloadAction<unknown>) => {
      void action.payload;
      return state;
    },
    setLastSelected: (state, action: PayloadAction<number>) => {
      state.lastSelected = action.payload;
    },
    setCurrentOffset: (state, action: PayloadAction<number>) => {
      state.currentOffset = action.payload;
    },
    setGlobalOffset: (state, action: PayloadAction<number>) => {
      state.globalOffset = action.payload;
    },
    translateLyricRequest: (state, action: PayloadAction<TranslateLyricRequestPayload>) => {
      void action.payload;
      return state;
    },
    translateLyricSuccess: (state, action: PayloadAction<Music['lyric']>) => {
      state.list = state.list.map((item, i) =>
        i === state.lastSelected
          ? ({
              ...item,
              hasTlit: true,
              lyric: action.payload,
            } as Music)
          : item,
      );
    },
    translateLyricFailure: (state, action: PayloadAction<unknown>) => {
      void action.payload;
      return state;
    },
  },
});

const {
  searchMusicRequest,
  searchMusicSuccess,
  searchMusicFailure,
  translateLyricRequest,
  translateLyricSuccess,
  translateLyricFailure,
  ...baseActions
} = musicSlice.actions;

export const musicActions = {
  ...baseActions,
  searchMusic: {
    request: searchMusicRequest,
    success: searchMusicSuccess,
    failure: searchMusicFailure,
  },
  translateLyric: {
    request: translateLyricRequest,
    success: translateLyricSuccess,
    failure: translateLyricFailure,
  },
};

export const musicReducer = musicSlice.reducer;
