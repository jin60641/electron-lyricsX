import { createAction } from 'typesafe-actions';

import {
  Actions,
  LocaleState,
} from './types';

const setLocale = createAction(Actions.SET_LOCALE)<LocaleState['code']>();

const setPlayer = createAction(Actions.SET_PLAYER)<LocaleState['player']>();

export default { setLocale, setPlayer };
