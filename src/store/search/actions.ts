import { createAction } from 'typesafe-actions';

import { Actions, SearchState } from './types';

const setTitle = createAction(Actions.SET_TITLE)<SearchState['title']>();
const setArtist = createAction(Actions.SET_ARTIST)<SearchState['artist']>();

export default {
  setTitle,
  setArtist,
};
