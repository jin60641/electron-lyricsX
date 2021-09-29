import { Epic as RxEpic } from 'redux-observable';
import { ActionType } from 'typesafe-actions';

import musicActions from './music/actions';
import { MusicState } from './music/types';

export interface RootState {
  music: MusicState,
}

export type RootAction = ActionType<typeof musicActions>;

export const channels = [
  musicActions.resetMusic,
  musicActions.startMusic,
  musicActions.stopMusic,
  musicActions.pauseMusic,
];

export type Epic = RxEpic<
RootAction,
RootAction,
RootState
>;
