import { combineEpics } from 'redux-observable';
import { from } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import { Epic } from '../types';

import actions from './actions';
import { requestSearchMusic, requestTranslateLyric } from './apis';

const searchMusicEpic: Epic = (action$) =>
  action$.pipe(
    filter(isActionOf(actions.searchMusic.request)),
    mergeMap((action) => from(requestSearchMusic(action.payload)).pipe(mergeMap(() => []))),
  );

const translateLyricEpic: Epic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(actions.setLastSelected)),
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
    filter(isActionOf(actions.searchMusic.success)),
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
