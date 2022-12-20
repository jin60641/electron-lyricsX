import { persistReducer } from 'redux-persist';
import { createReducer } from 'typesafe-actions';

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
    lastSelected: undefined,
    searchIndex: 0,
    isPlaying: true,
  }))
  .handleAction(musicActions.stopMusic, () => ({ ...initialState }))
  .handleAction(musicActions.pauseMusic, (state) => ({
    ...state,
    isPlaying: false,
  }))
  .handleAction(musicActions.selectMusic, (state, action) => ({
    ...state,
    lastSelected: action.payload,
    list: state.list.map((music, i) => ({
      ...music,
      isSelected: i === action.payload,
    })),
  }))
  .handleAction(musicActions.searchMusic.success, (state, action) => ({
    ...state,
    lastSelected: 0,
    searchIndex: 0,
    searchList: action.payload,
  }))
  .handleAction(musicActions.setCurrentOffset, (state, action) => ({
    ...state,
    currentOffset: action.payload,
  }))
  .handleAction(musicActions.setGlobalOffset, (state, action) => ({
    ...state,
    globalOffset: action.payload,
  }))
  .handleAction(musicActions.setSearchIndex, (state, action) => ({
    ...state,
    searchIndex: action.payload,
    list: state.searchList,
    lastSelected: action.payload,
  }));

export default persistReducer(persistConfig, musicReducer);
