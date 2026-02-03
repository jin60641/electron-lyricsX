import { combineEpics } from 'redux-observable';
import { from } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

import { Epic, RootAction } from '../types';

import actions from './actions';
import { requestSearchMusic, requestTranslateLyric } from './apis';

const isSearchMusicRequest = (
  action: RootAction,
): action is ReturnType<typeof actions.searchMusic.request> =>
  action.type === actions.searchMusic.request.type;

const isSetLastSelected = (
  action: RootAction,
): action is ReturnType<typeof actions.setLastSelected> =>
  action.type === actions.setLastSelected.type;

const isSearchMusicSuccess = (
  action: RootAction,
): action is ReturnType<typeof actions.searchMusic.success> =>
  action.type === actions.searchMusic.success.type;

const searchMusicEpic: Epic = (action$) =>
  action$.pipe(
    filter(isSearchMusicRequest),
    mergeMap((action) => from(requestSearchMusic(action.payload)).pipe(mergeMap(() => []))),
  );

const translateLyricEpic: Epic = (action$, state$) =>
  action$.pipe(
    filter(isSetLastSelected),
    mergeMap((action) =>
      from(
        requestTranslateLyric({
          lyric: state$.value.music.list[action.payload]!.lyric,
          locale: state$.value.preference.locale.code,
        }),
      ).pipe(mergeMap(() => [])),
    ),
  );

const searchMusicSuccessEpic: Epic = (action$, state$) =>
  action$.pipe(
    filter(isSearchMusicSuccess),
    filter(() => !!state$.value.music.list.length),
    mergeMap(() =>
      from(
        requestTranslateLyric({
          lyric: state$.value.music.list[state$.value.music.lastSelected]!.lyric,
          locale: state$.value.preference.locale.code,
        }),
      ).pipe(mergeMap(() => [])),
    ),
  );

export default combineEpics(searchMusicEpic, translateLyricEpic, searchMusicSuccessEpic);
