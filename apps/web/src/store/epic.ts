import { combineEpics, Epic } from 'redux-observable';

import layoutEpic from './layout/epic';
import musicEpic from './music/epic';
import preferenceEpic from './preference/epic';

import { RootAction, RootState } from './types';

const epics: Epic<RootAction, RootAction, RootState>[] = [layoutEpic, preferenceEpic, musicEpic];

const rootEpic = combineEpics(...epics);

export default rootEpic;
