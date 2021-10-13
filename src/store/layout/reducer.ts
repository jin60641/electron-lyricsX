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
  }))
  .handleAction(layoutActions.setLineCount, (state, action) => ({
    ...state,
    lineCount: action.payload,
  }))
  .handleAction(layoutActions.setLyricSize, (state, action) => ({
    ...state,
    lyricSize: action.payload,
  }))
  .handleAction(layoutActions.setFontColor, (state, action) => ({
    ...state,
    fontColor: action.payload,
  }))
  .handleAction(layoutActions.setBackgroundOpacity, (state, action) => ({
    ...state,
    backgroundOpacity: action.payload,
  }))
  .handleAction(layoutActions.setBackgroundColor, (state, action) => ({
    ...state,
    backgroundColor: action.payload,
  }));

export default persistReducer(persistConfig, layoutReducer);
