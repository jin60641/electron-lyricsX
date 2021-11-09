import { combineEpics } from 'redux-observable';
import { from } from 'rxjs';
import {
  filter,
  mergeMap,
} from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import { Epic } from '../types';

import actions from './actions';
import { requestSearchMusic } from './apis';

const searchMusicEpic: Epic = (action$) => action$.pipe(
  filter(isActionOf(actions.searchMusic.request)),
  mergeMap((action) => from(requestSearchMusic(action.payload)).pipe(
    mergeMap(() => []),
  )),
);

export default combineEpics(
  searchMusicEpic,
);
