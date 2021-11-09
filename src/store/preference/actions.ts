import { createAction, createAsyncAction } from 'typesafe-actions';

import {
  Actions,
  PreferenceState,
  SetDraggablePayload,
  SetPlayerRequestPayload,
  SetPlayerSuccessPayload,
} from './types';

const setDraggable = createAction(Actions.SET_DRAGGABLE)<SetDraggablePayload>();
const setPlayer = createAsyncAction(
  Actions.SET_PLAYER_REQUEST,
  Actions.SET_PLAYER_SUCCESS,
  Actions.SET_PLAYER_FAILURE,
)<SetPlayerRequestPayload, SetPlayerSuccessPayload, void>();
const setLocale = createAction(Actions.SET_LOCALE)<PreferenceState['locale']>();

export default { setDraggable, setPlayer, setLocale };
