import { createAction, createAsyncAction } from 'typesafe-actions';

import { Info, Music } from '@repo/types';

import {
  Actions,
  SearchMusicRequestPayload,
  SearchMusicSuccessPayload,
  StartMusicPayload,
  TranslateLyricRequestPayload,
} from './types';

const resetMusic = createAction(Actions.RESET_MUSIC)();

const setCurrentOffset = createAction(Actions.SET_CURRENT_OFFSET)<number>();

const setGlobalOffset = createAction(Actions.SET_GLOBAL_OFFSET)<number>();

const startMusic = createAction(Actions.START_MUSIC)<StartMusicPayload>();
const stopMusic = createAction(Actions.STOP_MUSIC)();
const pauseMusic = createAction(Actions.PAUSE_MUSIC)();
const seekMusic = createAction(Actions.SEEK_MUSIC)<Info>();
const searchMusic = createAsyncAction(
  Actions.SEARCH_MUSIC_REQUEST,
  Actions.SEARCH_MUSIC_SUCCESS,
  Actions.SEARCH_MUSIC_FAILURE,
)<SearchMusicRequestPayload, SearchMusicSuccessPayload, void>();
const translateLyric = createAsyncAction(
  Actions.TRANSLATE_LYRIC_REQUEST,
  Actions.TRANSLATE_LYRIC_SUCCESS,
  Actions.TRANSLATE_LYRIC_FAILURE,
)<TranslateLyricRequestPayload, Music['lyric'], void>();
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
