import { createAction } from 'typesafe-actions';

import { Actions, LayoutState } from './types';

const setLayout = createAction(Actions.SET_LAYOUT)<LayoutState>();
const closePreference = createAction(Actions.CLOSE_PREFERENCE)();

export default {
  setLayout,
  closePreference,
};
