import { createAction } from 'typesafe-actions';

import { Actions, PreferenceState } from './types';

const setDraggable = createAction(Actions.SET_DRAGGABLE)<PreferenceState['draggable']>();
const setPlayer = createAction(Actions.SET_PLAYER)<PreferenceState['player']>();
const setLocale = createAction(Actions.SET_LOCALE)<PreferenceState['code']>();

export default { setDraggable, setPlayer, setLocale };
