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
  .handleAction(preferenceAction.setPlayer, (state, action) => ({
    ...state,
    player: action.payload,
  }))
  .handleAction(preferenceAction.setLocale, (state, action) => ({
    ...state,
    code: action.payload,
  }));

export default persistReducer(persistConfig, preferenceReducer);
