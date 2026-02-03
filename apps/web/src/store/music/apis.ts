import actions from './actions';
import { SearchMusicRequestPayload, TranslateLyricRequestPayload } from './types';

export const requestSearchMusic = async (payload: SearchMusicRequestPayload) =>
  window.bridge.ipc.send(actions.searchMusic.request.type, payload);

export const requestTranslateLyric = async (payload: TranslateLyricRequestPayload) => {
  window.bridge.ipc.send(actions.translateLyric.request.type, payload);
};
