export interface LayoutState {
  palette: Palette;
  lineCount: number;
  lyricSize: number;
  fontColor: string;
  backgroundOpacity: number;
  backgroundColor: string;
}

export enum Actions {
  SET_PALETTE = 'LAYOUT.SET_PALETTE',
  CLOSE_PREFERENCE = 'LAYOUT.CLOSE_PREFERENCE',

  SET_LINE_COUNT = 'LAYOUT.SET_LINE_COUNT',
  SET_LYRIC_SIZE = 'LAYOUT.SET_LYRIC_SIZE',
  SET_FONT_COLOR = 'LAYOUT.SET_FONT_COLOR',
  SET_BACKGROUND_OPACITY = 'LAYOUT.SET_BACKGROUND_OPACITY',
  SET_BACKGROUND_COLOR = 'LAYOUT.SET_BACKGROUND_COLOR',
}

export enum Palette {
  DARK = 'dark',
  DEVICE = 'device',
  LIGHT = 'light',
}

export const initialState: LayoutState = {
  palette: Palette.DEVICE,

  lineCount: 2,
  lyricSize: 28,
  backgroundOpacity: 1,
  backgroundColor: '#000000',
  fontColor: '#ffffff',
};
