import { combineReducers } from 'redux';

import isFetching from './isFetching/reducer';
import layout from './layout/reducer';
import locale from './locale/reducer';
import music from './music/reducer';

const rootReducer = combineReducers({
  layout,
  isFetching,
  music,
  locale,
});

export default rootReducer;
