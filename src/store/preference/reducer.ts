import { persistReducer } from 'redux-persist';
import { createReducer } from 'typesafe-actions';

import preferenceAction from './actions';
import { initialState, PreferenceState } from './types';

const persistConfig = {
  key: 'preference',
  storage: window.bridge.storage,
};

const preferenceReducer = createReducer<PreferenceState>(initialState)
  .handleAction(preferenceAction.setDraggable, (state, action) => ({
    ...state,
    draggable: action.payload,
  }))
  .handleAction(preferenceAction.setPlayer.success, (state, action) => ({
    ...state,
    player: action.payload,
  }))
  .handleAction(preferenceAction.setLocale, (state, action) => ({
    ...state,
    locale: action.payload,
  }))
  .handleAction(preferenceAction.setPreference, (state, action) => ({
    ...state,
    ...action.payload,
  }));

export default persistReducer(persistConfig, preferenceReducer);
