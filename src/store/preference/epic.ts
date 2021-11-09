import { combineEpics } from 'redux-observable';
import { from } from 'rxjs';
import {
  filter,
  mergeMap,
} from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import { Epic } from '../types';

import actions from './actions';
import { requestSetPlayer } from './apis';

const setPlayerEpic: Epic = (action$) => action$.pipe(
  filter(isActionOf(actions.setPlayer.request)),
  mergeMap((action) => from(requestSetPlayer(action.payload)).pipe(
    mergeMap(() => []),
  )),
);

export default combineEpics(
  setPlayerEpic,
);
