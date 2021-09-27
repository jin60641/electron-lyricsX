import {
  createAction,
  // createAsyncAction,
} from 'typesafe-actions';

import { Actions, Music } from './types';

const setCount = createAction(Actions.SET_COUNT)<number>();

const saveMusic = createAction(
  Actions.SAVE_MUSIC,
)<
string
>();

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

const openFinder = createAction(
  Actions.OPEN_FINDER,
)<string>();

const resetSearch = createAction(Actions.RESET_SEARCH)();

const startMusic = createAction(Actions.START_MUSIC)<Music[]>();
const stopMusic = createAction(Actions.STOP_MUSIC)();
const pauseMusic = createAction(Actions.PAUSE_MUSIC)();
const seekMusic = createAction(Actions.SEEK_MUSIC)<Music>();

export default {
  resetMusic,
  saveMusic,
  selectMusic,
  setCount,
  setLastSelected,
  openFinder,
  resetSearch,
  startMusic,
  stopMusic,
  pauseMusic,
  seekMusic,
};
