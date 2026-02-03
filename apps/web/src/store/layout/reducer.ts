import { persistReducer } from 'redux-persist';

import { layoutReducer } from '@repo/state';

const persistConfig = {
  key: 'layout',
  storage: window.bridge.storage,
};

export default persistReducer(persistConfig, layoutReducer);
