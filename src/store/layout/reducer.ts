import { createReducer } from 'typesafe-actions';

import layoutActions from './actions';
import { initialState, LayoutState } from './types';

const layoutReducer = createReducer<LayoutState>(initialState)
  .handleAction(layoutActions.setDrawer, (state, action) => ({
    ...state,
    drawer: action.payload,
  }))
  .handleAction(layoutActions.setPalette, (state, action) => ({
    ...state,
    palette: action.payload,
  }))
  .handleAction(layoutActions.setPreference, (state, action) => {
    let { preference } = state;
    if (action.payload === undefined || action.payload.length) {
      preference = action.payload;
    }
    return {
      ...state,
      preference,
    };
  })
  .handleAction(layoutActions.makeAlert, (state, action) => ({
    ...state,
    alert: action.payload,
  }))
  .handleAction(layoutActions.dismissAlert, (state) => ({
    ...state,
    alert: { ...initialState.alert },
  }));

export default layoutReducer;
