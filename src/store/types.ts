import { Epic as RxEpic } from 'redux-observable';
import { ActionType } from 'typesafe-actions';

import layoutActions from './layout/actions';
import { LayoutState } from './layout/types';
import localeActions from './locale/actions';
import { LocaleState } from './locale/types';
import musicActions from './music/actions';
import { MusicState } from './music/types';
import searchActions from './search/actions';
import { SearchState } from './search/types';

export interface RootState {
  music: MusicState,
  layout: LayoutState,
  locale: LocaleState,
  search: SearchState,
}

export type RootAction =
  ActionType<typeof musicActions> |
  ActionType<typeof localeActions> |
  ActionType<typeof layoutActions> |
  ActionType<typeof searchActions>;

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
