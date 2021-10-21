import { persistReducer } from 'redux-persist';
import { createReducer } from 'typesafe-actions';

import localeActions from './actions';
import { initialState, LocaleState } from './types';

const persistConfig = {
  key: 'locale',
  storage: window.bridge.storage,
};

const localeReducer = createReducer<LocaleState>(initialState)
  .handleAction(localeActions.setLocale, (state, action) => ({
    ...state,
    code: action.payload,
  }))
  .handleAction(localeActions.setPlayer, (state, action) => ({
    ...state,
    player: action.payload,
  }));

export default persistReducer(persistConfig, localeReducer);
