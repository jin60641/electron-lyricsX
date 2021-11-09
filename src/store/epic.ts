import { combineEpics, Epic } from 'redux-observable';

import layoutEpic from './layout/epic';
import preferenceEpic from './preference/epic';

const epics: Epic[] = [
  layoutEpic,
  preferenceEpic,
];

const rootEpic = combineEpics(...epics);

export default rootEpic;
