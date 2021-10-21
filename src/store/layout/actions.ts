import { createAction } from 'typesafe-actions';

import { Actions, LayoutState } from './types';

const setPalette = createAction(Actions.SET_PALETTE)<LayoutState['palette']>();
const closePreference = createAction(Actions.CLOSE_PREFERENCE)();
const setDraggable = createAction(Actions.SET_DRAGGABLE)<LayoutState['draggable']>();

const setLineCount = createAction(Actions.SET_LINE_COUNT)<LayoutState['lineCount']>();
const setLyricSize = createAction(Actions.SET_LYRIC_SIZE)<LayoutState['lyricSize']>();
const setFontColor = createAction(Actions.SET_FONT_COLOR)<LayoutState['fontColor']>();
const setBackgroundOpacity = createAction(Actions.SET_BACKGROUND_OPACITY)<LayoutState['backgroundOpacity']>();
const setBackgroundColor = createAction(Actions.SET_BACKGROUND_COLOR)<LayoutState['backgroundColor']>();

export default {
  setPalette,
  closePreference,
  setDraggable,
  setLineCount,
  setLyricSize,
  setFontColor,
  setBackgroundOpacity,
  setBackgroundColor,
};
