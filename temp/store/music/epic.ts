import { combineEpics } from 'redux-observable';
// import {
//   filter,
//   mergeMap,
// } from 'rxjs/operators';
// import { isActionOf } from 'typesafe-actions';

// import layoutActions from 'store/layout/actions';
// import { AlertType } from 'store/layout/types';

// import { Epic } from '../types';
// import { createAsyncEpic } from '../utils';

// import actions from './actions';

/*
const searchMusicFailureEpic: Epic = (action$) => action$.pipe(
  filter(isActionOf(actions.searchMusic.failure)),
  mergeMap(() => [layoutActions.makeAlert({
    type: AlertType.error,
    message: "There's no search results",
  })]),
);
*/

export default combineEpics(
  // searchMusicFailureEpic,
);
