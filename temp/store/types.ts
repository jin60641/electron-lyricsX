import { Epic as RxEpic } from 'redux-observable';
import { ActionType } from 'typesafe-actions';

import { IsFetchingState } from './isFetching/types';
import layoutActions from './layout/actions';
import { LayoutState } from './layout/types';
import localeActions from './locale/actions';
import { LocaleState } from './locale/types';
import musicActions from './music/actions';
import { MusicState } from './music/types';

export interface RootState {
  layout: LayoutState,
  isFetching: IsFetchingState,
  locale: LocaleState,
  music: MusicState,
}

export type RootAction =
  ActionType<typeof layoutActions> |
  ActionType<typeof musicActions> |
  ActionType<typeof localeActions>;

export const channels = [
  musicActions.resetMusic,
  musicActions.setCount,
  musicActions.startMusic,
  musicActions.stopMusic,
  musicActions.pauseMusic,
  musicActions.seekMusic,
  layoutActions.setPreference,
  layoutActions.makeAlert,
];

export type Epic = RxEpic<
RootAction,
RootAction,
RootState
>;
