import { createAction } from 'typesafe-actions';

import { Actions, LayoutState } from './types';

const setPalette = createAction(Actions.SET_PALETTE)<LayoutState['palette']>();
const setTitle = createAction(Actions.SET_TITLE)<LayoutState['title']>();
const setArtist = createAction(Actions.SET_ARTIST)<LayoutState['artist']>();
const closePreference = createAction(Actions.CLOSE_PREFERENCE)();
const setDraggable = createAction(Actions.SET_DRAGGABLE)<LayoutState['draggable']>();

export default { setPalette, closePreference, setDraggable, setTitle, setArtist };
