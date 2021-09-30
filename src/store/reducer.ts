import { combineReducers } from 'redux';

import layout from './layout/reducer';
import locale from './locale/reducer';
import music from './music/reducer';

const rootReducer = combineReducers({ music, layout, locale });

export default rootReducer;
