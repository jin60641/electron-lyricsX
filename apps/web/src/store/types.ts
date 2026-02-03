import { Epic as RxEpic } from 'redux-observable';
import { ActionType } from 'typesafe-actions';

import layoutActions from './layout/actions';
import musicActions from './music/actions';
import preferenceActions from './preference/actions';

import rootReducer from './reducer';
export type RootState = ReturnType<typeof rootReducer>;

export type RootAction =
  | ActionType<typeof musicActions>
  | ActionType<typeof preferenceActions>
  | ActionType<typeof layoutActions>;

export const channels = [
  musicActions.resetMusic,
  musicActions.startMusic,
  musicActions.stopMusic,
  musicActions.pauseMusic,
  preferenceActions.setPlayer.success,
  musicActions.searchMusic.success,
  musicActions.translateLyric.success,
];

export type Epic = RxEpic<RootAction, RootAction, RootState>;
