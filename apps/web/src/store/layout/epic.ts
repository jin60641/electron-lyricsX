import { combineEpics, ofType } from 'redux-observable';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Epic } from '../types';

import actions from './actions';
import { requestClosePreference } from './apis';

const closePreferenceEpic: Epic = (action$) =>
  action$.pipe(
    ofType(actions.closePreference.type),
    mergeMap(() => from(requestClosePreference()).pipe(mergeMap(() => []))),
  );

export default combineEpics(closePreferenceEpic);
