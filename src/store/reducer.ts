import { combineReducers } from 'redux';

import music from './music/reducer';

const rootReducer = combineReducers({ music });

export default rootReducer;
