import { combineEpics } from 'redux-observable';
import { from } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import { Epic } from '../types';

import actions from './actions';
import { requestSetDraggable, requestSetPlayer } from './apis';

const setPlayerEpic: Epic = (action$) =>
  action$.pipe(
    filter(isActionOf(actions.setPlayer.request)),
    mergeMap((action) => from(requestSetPlayer(action.payload)).pipe(mergeMap(() => []))),
  );

const setDraggableEpic: Epic = (action$) =>
  action$.pipe(
    filter(isActionOf(actions.setDraggable)),
    mergeMap((action) => from(requestSetDraggable(action.payload)).pipe(mergeMap(() => []))),
  );

export default combineEpics(setDraggableEpic, setPlayerEpic);
