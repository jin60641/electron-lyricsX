import { persistReducer } from 'redux-persist';
import { createReducer } from 'typesafe-actions';

import { Music } from 'types/lyric';

import musicActions from './actions';
import {
  initialState,
  MusicState,
} from './types';

const persistConfig = {
  key: 'music',
  storage: window.bridge.storage,
  whitelist: [],
};

const musicReducer = createReducer<MusicState>(initialState)
  .handleAction(musicActions.resetMusic, (state) => ({
    ...state,
    list: [],
  }))
  .handleAction(musicActions.startMusic, (state, action) => ({
    ...state,
    ...action.payload,
    isPlaying: true,
  }))
  .handleAction(musicActions.stopMusic, () => ({ ...initialState }))
  .handleAction(musicActions.pauseMusic, (state) => ({
    ...state,
    isPlaying: false,
  }))
  .handleAction(musicActions.searchMusic.success, (state, action) => ({
    ...state,
    list: action.payload,
  }))
  .handleAction(musicActions.setCurrentOffset, (state, action) => ({
    ...state,
    currentOffset: action.payload,
  }))
  .handleAction(musicActions.setGlobalOffset, (state, action) => ({
    ...state,
    globalOffset: action.payload,
  }))
  .handleAction(musicActions.setLastSelected, (state, action) => ({
    ...state,
    lastSelected: action.payload,
  }))
  .handleAction(musicActions.translateLyric.success, (state, action) => ({
    ...state,
    list: state.list.map((item, i) => (i === state.lastSelected ? ({
      ...item,
      hasTlit: true,
      lyric: action.payload,
    } as Music) : item)),
  }));

export default persistReducer(persistConfig, musicReducer);
