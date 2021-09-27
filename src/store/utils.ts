import { from } from 'rxjs';
import {
  catchError,
  concatMap,
  exhaustMap,
  filter,
  flatMap,
  map,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import layoutActions from './layout/actions';
import { AlertType } from './layout/types';
import { Epic } from './types';

type MapOperator = typeof exhaustMap | typeof switchMap | typeof concatMap | typeof flatMap;

export const createAsyncEpic = (
  asyncActionCreator: any,
  asyncApi: (payload: any, meta?: any) => Promise<any>,
  mapOperator: MapOperator = exhaustMap,
) => {
  const asyncEpic: Epic = (action$) => action$.pipe(
    filter(isActionOf(asyncActionCreator.request)),
    (mapOperator as typeof exhaustMap)((action) => from(asyncApi(action.payload, action.meta)).pipe(
      map((response) => asyncActionCreator.success(response, action.meta)),
      takeUntil(action$.pipe(
        filter((cancelAction) => (asyncActionCreator.cancel
          ? isActionOf(asyncActionCreator.cancel)(cancelAction)
          : false
        )),
      )),
      catchError((e) => [
        asyncActionCreator.failure(e),
        layoutActions.makeAlert({
          message: e?.response?.data || e.message,
          type: AlertType.error,
        }),
      ]),
    )),
  );

  return asyncEpic;
};
