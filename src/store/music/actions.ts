import {
  createAction,
  // createAsyncAction,
} from 'typesafe-actions';

import { Actions, Music } from './types';

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

const startMusic = createAction(Actions.START_MUSIC)<Music[]>();
const stopMusic = createAction(Actions.STOP_MUSIC)();
const pauseMusic = createAction(Actions.PAUSE_MUSIC)();
const seekMusic = createAction(Actions.SEEK_MUSIC)<Music>();

export default {
  resetMusic,
  selectMusic,
  setLastSelected,
  startMusic,
  stopMusic,
  pauseMusic,
  seekMusic,
  setCurrentOffset,
  setGlobalOffset,
};
