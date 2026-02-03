import { combineEpics } from 'redux-observable';
import { from } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

import { Epic, RootAction } from '../types';

import actions from './actions';
import { requestSetDraggable, requestSetPlayer } from './apis';

const isSetPlayerRequest = (
  action: RootAction,
): action is ReturnType<typeof actions.setPlayer.request> =>
  action.type === actions.setPlayer.request.type;

const isSetDraggable = (
  action: RootAction,
): action is ReturnType<typeof actions.setDraggable> => action.type === actions.setDraggable.type;

const setPlayerEpic: Epic = (action$) =>
  action$.pipe(
    filter(isSetPlayerRequest),
    mergeMap((action) => from(requestSetPlayer(action.payload)).pipe(mergeMap(() => []))),
  );

const setDraggableEpic: Epic = (action$) =>
  action$.pipe(
    filter(isSetDraggable),
    mergeMap((action) => from(requestSetDraggable(action.payload)).pipe(mergeMap(() => []))),
  );

export default combineEpics(setDraggableEpic, setPlayerEpic);
