import type { AnyAction } from '@reduxjs/toolkit';
import { Epic as RxEpic } from 'redux-observable';

import musicActions from './music/actions';
import preferenceActions from './preference/actions';

import rootReducer from './reducer';
export type RootState = ReturnType<typeof rootReducer>;

export type RootAction = AnyAction;

export const channels = [
  musicActions.resetMusic,
  musicActions.startMusic,
  musicActions.stopMusic,
  musicActions.pauseMusic,
  preferenceActions.setPlayer.success,
  musicActions.searchMusic.success,
  musicActions.translateLyric.success,
] as const;

export type ChannelActionCreator = (typeof channels)[number];

export type Epic = RxEpic<RootAction, RootAction, RootState>;
