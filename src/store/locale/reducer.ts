import { persistReducer } from 'redux-persist';
import { createReducer } from 'typesafe-actions';

import localeActions from './actions';
import { initialState, LocaleState } from './types';

const persistConfig = {
  key: 'locale',
  storage: window.bridge.storage,
};

const localeReducer = createReducer<LocaleState>(initialState)
  .handleAction(localeActions.setLocale, (_, action) => ({ code: action.payload }));

export default persistReducer(persistConfig, localeReducer);
