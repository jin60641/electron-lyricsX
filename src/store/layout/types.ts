export interface LayoutState {
  palette: Palette;
  lineCount: number;
  fontSize: number;
  fontColor: string;
  fontOpacity: number;
  textShadowSize: number;
  textShadowColor: string;
  textShadowOpacity: number;
  backgroundColor: string;
  backgroundOpacity: number;
}

export enum Actions {
  SET_LAYOUT = 'LAYOUT.SET_LAYOUT',
  CLOSE_PREFERENCE = 'LAYOUT.CLOSE_PREFERENCE',
}

export enum Palette {
  DARK = 'dark',
  DEVICE = 'device',
  LIGHT = 'light',
}

export const initialState: LayoutState = {
  palette: Palette.DEVICE,

  lineCount: 2,
  fontSize: 28,
  fontColor: '#ffffff',
  fontOpacity: 1,
  textShadowSize: 28,
  textShadowColor: '#ffffff',
  textShadowOpacity: 1,
  backgroundColor: '#000000',
  backgroundOpacity: 1,
};
