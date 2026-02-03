import { createAction } from 'typesafe-actions';

import { Info, Music } from '@repo/types';

import {
  Actions,
  SearchMusicRequestPayload,
  SearchMusicSuccessPayload,
  StartMusicPayload,
  TranslateLyricRequestPayload,
} from './types';
import { createAsyncActionWithTypes } from '../utils';

const resetMusic = createAction(Actions.RESET_MUSIC)();

const setCurrentOffset = createAction(Actions.SET_CURRENT_OFFSET)<number>();

const setGlobalOffset = createAction(Actions.SET_GLOBAL_OFFSET)<number>();

const startMusic = createAction(Actions.START_MUSIC)<StartMusicPayload>();
const stopMusic = createAction(Actions.STOP_MUSIC)();
const pauseMusic = createAction(Actions.PAUSE_MUSIC)();
const seekMusic = createAction(Actions.SEEK_MUSIC)<Info>();
const searchMusic = createAsyncActionWithTypes<
  SearchMusicRequestPayload,
  SearchMusicSuccessPayload,
  void
>(Actions.SEARCH_MUSIC);
const translateLyric = createAsyncActionWithTypes<TranslateLyricRequestPayload, Music['lyric'], void>(
  Actions.TRANSLATE_LYRIC,
);
const setLastSelected = createAction(Actions.SET_LAST_SELECTED)<number>();

export default {
  resetMusic,
  startMusic,
  stopMusic,
  pauseMusic,
  seekMusic,
  searchMusic,
  setLastSelected,
  setCurrentOffset,
  setGlobalOffset,
  translateLyric,
};
