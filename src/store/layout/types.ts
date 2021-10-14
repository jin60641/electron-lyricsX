export interface LayoutState {
  palette: Palette;
  draggable: boolean;
  lineCount: number;
  lyricSize: number;
  fontColor: FontColor;
  backgroundOpacity: number;
  backgroundColor: BackgroundColor.BLACK,
}

export enum Actions {
  SET_PALETTE = 'LAYOUT.SET_PALETTE',
  CLOSE_PREFERENCE = 'LAYOUT.CLOSE_PREFERENCE',

  SET_DRAGGABLE = 'LAYOUT.SET_DRAGGABLE',

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

export enum FontColor {
  BLACK = 'black',
  RED = 'red',
  YELLOW = 'yellow',
  GREEN = 'green',
  BLUE = 'blue',
  WHITE = 'white',
}

export enum BackgroundColor {
  BLACK = 'rgba(0,0,0,.6)',
  RED = 'rgba(255,0,0,.6)',
  GREEN = 'rgba(0,255,0,.6)',
  BLUE = 'rgba(0,0,255,.6)',
}

export const initialState: LayoutState = {
  palette: Palette.DEVICE,

  draggable: false,

  lineCount: 2,
  lyricSize: 28,
  fontColor: FontColor.WHITE,
  backgroundOpacity: 1,
  backgroundColor: BackgroundColor.BLACK,
};
