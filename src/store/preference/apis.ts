import { getType } from 'typesafe-actions';

import actions from './actions';
import { SetPlayerRequestPayload } from './types';

export const requestSetPlayer: (
  payload: SetPlayerRequestPayload,
) => Promise<undefined> = async (payload) => {
  window.bridge.ipc.send(getType(actions.setPlayer.request), payload);
  return undefined;
};
