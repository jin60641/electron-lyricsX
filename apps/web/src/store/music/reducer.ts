import { persistReducer } from 'redux-persist';

import { musicReducer } from '@repo/state';

const persistConfig = {
  key: 'music',
  storage: window.bridge.storage,
  whitelist: [],
};

export default persistReducer(persistConfig, musicReducer);
