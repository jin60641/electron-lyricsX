import { combineEpics, Epic } from 'redux-observable';

import layoutEpic from './layout/epic';
import musicEpic from './music/epic';
import preferenceEpic from './preference/epic';

const epics: Epic[] = [
  layoutEpic,
  preferenceEpic,
  musicEpic,
];

const rootEpic = combineEpics(...epics);

export default rootEpic;
