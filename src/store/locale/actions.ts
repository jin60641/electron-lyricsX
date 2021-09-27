import { createAction } from 'typesafe-actions';

import {
  Actions,
  LocaleState,
} from './types';

const setLocale = createAction(Actions.SET_LOCALE)<LocaleState['code']>();

export default { setLocale };
