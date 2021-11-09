import { createAction, createAsyncAction } from 'typesafe-actions';

import { Actions, PreferenceState } from './types';

const setDraggable = createAction(Actions.SET_DRAGGABLE)<PreferenceState['draggable']>();
const setPlayer = createAsyncAction(
  Actions.SET_PLAYER_REQUEST,
  Actions.SET_PLAYER_SUCCESS,
  Actions.SET_PLAYER_FAILURE,
)<PreferenceState['player'], PreferenceState['player'], void>();
const setLocale = createAction(Actions.SET_LOCALE)<PreferenceState['locale']>();

export default { setDraggable, setPlayer, setLocale };
