import { createAction } from 'typesafe-actions';

import { Actions, AlertOption, LayoutState } from './types';

const makeAlert = createAction(Actions.MAKE_ALERT)<AlertOption>();
const dismissAlert = createAction(Actions.DISMISS_ALERT)();

const setDrawer = createAction(Actions.SET_DRAWER)<boolean>();
const setSearch = createAction(Actions.SET_SEARCH)<boolean>();
const setPreference = createAction(Actions.SET_PREFERENCE)<LayoutState['preference']>();
const setPalette = createAction(Actions.SET_PALETTE)<LayoutState['palette']>();

export default {
  makeAlert,
  dismissAlert,
  setDrawer,
  setSearch,
  setPalette,
  setPreference,
};
