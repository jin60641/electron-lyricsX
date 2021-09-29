import { createReducer } from 'typesafe-actions';

import musicActions from './actions';
import {
  initialState,
  MusicState,
} from './types';

const musicReducer = createReducer<MusicState>(initialState)
  .handleAction(musicActions.resetMusic, (state) => ({
    ...state,
    list: [],
  }))
  .handleAction(musicActions.setLastSelected, (state, action) => ({
    ...state,
    lastSelected: action.payload,
  }))
  .handleAction(musicActions.startMusic, (state, action) => ({
    ...state,
    count: 1,
    lastSelected: 0,
    list: action.payload,
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
  }));

export default musicReducer;
