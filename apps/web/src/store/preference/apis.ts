import actions from './actions';
import layoutActions from '../layout/actions';
import { SetDraggablePayload, SetPlayerRequestPayload } from './types';

export const requestSetPlayer: (payload: SetPlayerRequestPayload) => Promise<undefined> = async (
  payload,
) => {
  window.bridge.ipc.send(actions.setPlayer.request.type, payload);
  return undefined;
};

export const requestSetDraggable: (payload: SetDraggablePayload) => Promise<undefined> = async (
  payload,
) => {
  window.bridge.ipc.send(layoutActions.changeDraggable.type, { draggable: payload });
  return undefined;
};
