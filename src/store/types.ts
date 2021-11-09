import { Epic as RxEpic } from 'redux-observable';
import { ActionType } from 'typesafe-actions';

import layoutActions from './layout/actions';
import { LayoutState } from './layout/types';
import musicActions from './music/actions';
import { MusicState } from './music/types';
import preferenceActions from './preference/actions';
import { PreferenceState } from './preference/types';

export interface RootState {
  music: MusicState,
  layout: LayoutState,
  preference: PreferenceState,
}

export type RootAction =
  ActionType<typeof musicActions> |
  ActionType<typeof preferenceActions> |
  ActionType<typeof layoutActions>;

export const channels = [
  musicActions.resetMusic,
  musicActions.startMusic,
  musicActions.stopMusic,
  musicActions.pauseMusic,
  preferenceActions.setPlayer.success,
];

export type Epic = RxEpic<
RootAction,
RootAction,
RootState
>;
