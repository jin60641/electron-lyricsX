import { getType } from 'typesafe-actions';

import actions from './actions';
import { SearchMusicRequestPayload } from './types';

export const requestSearchMusic = async (payload: SearchMusicRequestPayload) => (
  window.bridge.ipc.send(getType(actions.searchMusic.request), payload)
);
