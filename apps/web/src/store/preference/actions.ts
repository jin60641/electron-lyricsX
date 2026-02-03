import { createAction } from 'typesafe-actions';

import {
  Actions,
  PreferenceState,
  SetDraggablePayload,
  SetPlayerRequestPayload,
  SetPlayerSuccessPayload,
  SetPreferencePayload,
} from './types';
import { createAsyncActionWithTypes } from '../utils';

const setDraggable = createAction(Actions.SET_DRAGGABLE)<SetDraggablePayload>();
const setPreference = createAction(Actions.SET_PREFERENCE)<SetPreferencePayload>();
const setPlayer = createAsyncActionWithTypes<
  SetPlayerRequestPayload,
  SetPlayerSuccessPayload,
  void
>(Actions.SET_PLAYER);
const setLocale = createAction(Actions.SET_LOCALE)<PreferenceState['locale']>();

export default { setDraggable, setPlayer, setLocale, setPreference };
