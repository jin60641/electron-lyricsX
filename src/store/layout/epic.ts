import { combineEpics } from 'redux-observable';
import { from } from 'rxjs';
import {
  filter,
  mergeMap,
} from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import { Epic } from '../types';

import actions from './actions';
import { requestClosePreference } from './apis';

const closePreferenceEpic: Epic = (action$) => action$.pipe(
  filter(isActionOf(actions.closePreference)),
  mergeMap(() => from(requestClosePreference()).pipe(
    mergeMap(() => []),
  )),
);

export default combineEpics(
  closePreferenceEpic,
);
