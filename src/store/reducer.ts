import { combineReducers } from 'redux';

import layout from './layout/reducer';
import locale from './locale/reducer';
import music from './music/reducer';
import search from './search/reducer';

const rootReducer = combineReducers({ music, layout, locale, search });

export default rootReducer;
