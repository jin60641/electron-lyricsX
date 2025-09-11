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

import { Epic } from './types';

type MapOperator = typeof exhaustMap | typeof switchMap | typeof concatMap | typeof flatMap;

export const createAsyncEpic = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asyncActionCreator: any, // TODO: async action set type def
  asyncApi: (payload: unknown, meta?: unknown) => Promise<unknown>,
  mapOperator: MapOperator = exhaustMap,
) => {
  const asyncEpic: Epic = (action$) =>
    action$.pipe(
      filter(isActionOf(asyncActionCreator.request)),
      (mapOperator as typeof exhaustMap)((action) =>
        from(asyncApi(action.payload, action.meta)).pipe(
          map((response) => asyncActionCreator.success(response, action.meta)),
          takeUntil(
            action$.pipe(
              filter((cancelAction) =>
                asyncActionCreator.cancel
                  ? isActionOf(asyncActionCreator.cancel)(cancelAction)
                  : false,
              ),
            ),
          ),
          catchError((e) => [asyncActionCreator.failure(e)]),
        ),
      ),
    );

  return asyncEpic;
};
