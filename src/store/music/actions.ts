import { createAction, createAsyncAction } from 'typesafe-actions';

import {
  Actions,
  Music,
  SearchMusicRequestPayload,
  SearchMusicSuccessPayload,
  StartMusicPayload,
} from './types';

const selectMusic = createAction(
  Actions.SELECT_MUSIC,
)<
number
>();

const setLastSelected = createAction(
  Actions.SET_LAST_SELECTED,
)<
number
>();

const resetMusic = createAction(
  Actions.RESET_MUSIC,
)();

const setCurrentOffset = createAction(
  Actions.SET_CURRENT_OFFSET,
)<
number
>();

const setGlobalOffset = createAction(
  Actions.SET_GLOBAL_OFFSET,
)<
number
>();

const startMusic = createAction(Actions.START_MUSIC)<StartMusicPayload>();
const stopMusic = createAction(Actions.STOP_MUSIC)();
const pauseMusic = createAction(Actions.PAUSE_MUSIC)();
const seekMusic = createAction(Actions.SEEK_MUSIC)<Music>();
const searchMusic = createAsyncAction(
  Actions.SEARCH_MUSIC_REQUEST,
  Actions.SEARCH_MUSIC_SUCCESS,
  Actions.SEARCH_MUSIC_FAILURE,
)<SearchMusicRequestPayload, SearchMusicSuccessPayload, void>();
const setSearchIndex = createAction(Actions.SET_SEARCH_INDEX)<number>();

export default {
  resetMusic,
  selectMusic,
  setLastSelected,
  startMusic,
  stopMusic,
  pauseMusic,
  seekMusic,
  searchMusic,
  setSearchIndex,
  setCurrentOffset,
  setGlobalOffset,
};
