import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import { FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync';
import type { Middleware } from 'redux';

import rootEpic from './epic';
import actions from './preference/actions';
import rootReducer from './reducer';
import { channels, RootState, RootAction } from './types';

const loggerMiddleware = createLogger() as Middleware<object, RootState>;
const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState>();

const stateSyncMiddleware = createStateSyncMiddleware({
  blacklist: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
}) as Middleware<object, RootState>;

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    const baseMiddleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(epicMiddleware, stateSyncMiddleware);

    if (import.meta.env.DEV) {
      return baseMiddleware.concat(loggerMiddleware);
    }

    return baseMiddleware;
  },
});

epicMiddleware.run(rootEpic);
initMessageListener(store);

channels.forEach((channel) => {
  window.bridge.ipc.receive(channel.type, (data) => {
    store.dispatch((channel as (payload?: unknown) => RootAction)(data));
  });
});

const persistHandler = () => {
  const state = store.getState();
  const { player } = state.preference;
  window.bridge.ipc.send(actions.setPlayer.request.type, player);
};

const persistor = persistStore(store, undefined, persistHandler);

export { store, persistor };
