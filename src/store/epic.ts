import { combineEpics, Epic } from 'redux-observable';

import layoutEpic from './layout/epic';

const epics: Epic[] = [
  layoutEpic,
];

const rootEpic = combineEpics(...epics);

export default rootEpic;
