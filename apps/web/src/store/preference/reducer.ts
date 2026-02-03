import { persistReducer } from 'redux-persist';

import { preferenceReducer } from '@repo/state';

const persistConfig = {
  key: 'preference',
  storage: window.bridge.storage,
};

export default persistReducer(persistConfig, preferenceReducer);
