import { combineEpics, Epic } from 'redux-observable';

import musicEpic from './music/epic';

const epics: Epic[] = [
  musicEpic,
];

const rootEpic = combineEpics(...epics);

export default rootEpic;
