import { Epic as RxEpic } from 'redux-observable';
import { ActionType } from 'typesafe-actions';

import layoutActions from './layout/actions';
import { LayoutState } from './layout/types';
import localeActions from './locale/actions';
import { LocaleState } from './locale/types';
import musicActions from './music/actions';
import { MusicState } from './music/types';

export interface RootState {
  music: MusicState,
  layout: LayoutState,
  locale: LocaleState,
}

export type RootAction =
  ActionType<typeof musicActions> |
  ActionType<typeof localeActions> |
  ActionType<typeof layoutActions>;

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
