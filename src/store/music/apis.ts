import { getType } from 'typesafe-actions';

import actions from './actions';
import { SearchMusicRequestPayload, TranslateLyricRequestPayload } from './types';

export const requestSearchMusic = async (payload: SearchMusicRequestPayload) => (
  window.bridge.ipc.send(getType(actions.searchMusic.request), payload)
);

export const requestTranslateLyric = async (
  payload: TranslateLyricRequestPayload,
) => {
  window.bridge.ipc.send(getType(actions.translateLyric.request), payload);
};
