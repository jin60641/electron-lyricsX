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
  blacklist: ['input'],
};

const musicReducer = createReducer<MusicState>(initialState)
  .handleAction(musicActions.resetMusic, (state) => ({
    ...state,
    count: 0,
    list: [],
  }))
  .handleAction(musicActions.setLastSelected, (state, action) => ({
    ...state,
    lastSelected: action.payload,
  }))
  .handleAction(musicActions.setCount, (state, action) => ({
    ...state,
    count: state.count + action.payload,
    lastCount: state.list.length,
  }))
  .handleAction(musicActions.startMusic, (state, action) => ({
    ...state,
    count: 1,
    lastSelected: 0,
    list: action.payload,
    isPlaying: true,
  }))
  .handleAction(musicActions.seekMusic, (state, action) => ({
    ...state,
    list: state.list.map((music, i) => (i === state.lastSelected ? ({
      ...music,
      position: action.payload.position,
    }) : music)),
  }))
  .handleAction(musicActions.pauseMusic, (state) => ({
    ...state,
    isPlaying: false,
  }))
  .handleAction(musicActions.resetSearch, (state) => ({
    ...state,
    search: [],
  }))
  .handleAction(musicActions.saveMusic, (state, action) => ({
    ...state,
    list: state.list.map((music, i) => (i === state.lastSelected ? ({
      ...music,
      lyric: action.payload,
    }) : music)),
  }))
  /*
  .handleAction(musicActions.searchMusic.success, (state, action) => ({
    ...state,
    search: action.payload,
  }))
  */
  .handleAction(musicActions.selectMusic, (state, action) => ({
    ...state,
    lastSelected: action.payload,
    list: state.list.map((music, i) => ({
      ...music,
      isSelected: i === action.payload,
    })),
  }));

export default persistReducer(persistConfig, musicReducer);
