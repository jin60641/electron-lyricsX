import {
  applyMiddleware, compose, createStore, Middleware,
} from 'redux';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync';
import { ActionCreator, getType } from 'typesafe-actions';

import rootEpic from './epic';
import actions from './preference/actions';
import rootReducer from './reducer';
import { channels, RootAction, RootState } from './types';

const composeEnhancers = compose;

const loggerMiddleware = createLogger();
const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState>();

const stateSyncMiddleware = createStateSyncMiddleware({
  blacklist: [
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  ],
});

const middlewares: Middleware[] = [
  epicMiddleware,
  stateSyncMiddleware,
];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(loggerMiddleware);
}

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlewares)),
);

epicMiddleware.run(rootEpic);
initMessageListener(store);

channels.forEach((channel) => {
  window.bridge.ipc.receive(getType(channel as ActionCreator), (data) => {
    store.dispatch(channel(data));
  });
});

const persistHandler = () => {
  const state = store.getState();
  const { player } = state.preference;
  window.bridge.ipc.send(getType(actions.setPlayer.request), player);
};

const persistor = persistStore(store, undefined, persistHandler);

export {
  store,
  persistor,
};
