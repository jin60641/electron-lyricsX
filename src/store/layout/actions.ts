import { createAction } from 'typesafe-actions';

import { Actions, LayoutState } from './types';

const setPalette = createAction(Actions.SET_PALETTE)<LayoutState['palette']>();
const closePreference = createAction(Actions.CLOSE_PREFERENCE)();

export default { setPalette, closePreference };
