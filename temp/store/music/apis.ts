/*
import { getType } from 'typesafe-actions';

import actions from './actions';
import { SaveMusicPayload } from './types';

export const requestSearchMusic: (
  payload: SearchMusicPayload,
) => Promise<undefined> = async (payload) => {
  window.bridge.ipc.send(getType(actions.saveMusic), payload);
  return undefined;
};
*/

export {};
