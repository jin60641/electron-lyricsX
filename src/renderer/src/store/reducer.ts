import { combineReducers } from 'redux';

import layout from './layout/reducer';
import music from './music/reducer';
import preference from './preference/reducer';

const rootReducer = combineReducers({ music, layout, preference });

export default rootReducer;
