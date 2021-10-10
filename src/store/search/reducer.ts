import { persistReducer } from 'redux-persist';
import { createReducer } from 'typesafe-actions';

import searchActions from './actions';
import { initialState, SearchState } from './types';

const persistConfig = {
  key: 'search',
  storage: window.bridge.storage,
  whiteList: [],
};

const searchReducer = createReducer<SearchState>(initialState)
  .handleAction(searchActions.setTitle, (state, action) => ({
    ...state,
    title: action.payload,
  }))
  .handleAction(searchActions.setArtist, (state, action) => ({
    ...state,
    artist: action.payload,
  }));

export default persistReducer(persistConfig, searchReducer);
