import { persistReducer } from 'redux-persist';
import { createReducer } from 'typesafe-actions';

import layoutActions from './actions';
import { initialState, LayoutState } from './types';

const persistConfig = {
  key: 'layout',
  storage: window.bridge.storage,
};

const layoutReducer = createReducer<LayoutState>(initialState)
  .handleAction(layoutActions.setPalette, (state, action) => ({
    ...state,
    palette: action.payload,
  }))
  .handleAction(layoutActions.setDraggable, (state, action) => ({
    ...state,
    draggable: action.payload,
  }));

export default persistReducer(persistConfig, layoutReducer);
