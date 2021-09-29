import { Reducer } from 'typesafe-actions';

import { RootAction } from 'store/types';

import {
  Actions,
  initialState,
  IsFetchingState,
  Middleware,
} from './types';

const middlewares: {
  [key: string]: Middleware,
} = {};

const createMiddleware = (type: string, bool: boolean) => (state: IsFetchingState) => ({
  ...state,
  [type]: bool,
});

Actions.forEach((actions) => {
  Object.values(actions).forEach((action) => {
    const [type, status] = action.split('#');
    if (!status) {
      return;
    }
    if (initialState[type] !== false) {
      initialState[type] = false;
    }
    middlewares[action] = createMiddleware(type, status === 'REQUEST');
  });
});

const isFetching: Reducer<IsFetchingState, RootAction> = (state = initialState, action) => {
  const handler = middlewares[action.type];
  if (handler) {
    return handler(state);
  }
  return state;
};

export default isFetching;
