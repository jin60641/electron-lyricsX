import { getType } from 'typesafe-actions';

import { preferenceActions } from './preferenceSlice';
import { SetDraggablePayload, SetPlayerRequestPayload } from './types';

export const requestSetPlayer: (
  payload: SetPlayerRequestPayload,
) => Promise<undefined> = async (payload) => {
  window.bridge.ipc.send(getType(preferenceActions.setPlayer.request), payload);
  return undefined;
};

export const requestSetDraggable: (
  payload: SetDraggablePayload,
) => Promise<undefined> = async (payload) => {
  window.bridge.ipc.send('LAYOUT.CHANGE_DRAGGABLE', { draggable: payload });
  return undefined;
};
