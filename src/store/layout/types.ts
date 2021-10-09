export interface LayoutState {
  palette: Palette;
  title: string | undefined;
  artist: string | undefined;
  draggable: boolean;
}

export enum Actions {
  SET_PALETTE = 'LAYOUT.SET_PALETTE',
  CLOSE_PREFERENCE = 'LAYOUT.CLOSE_PREFERENCE',

  SET_TITLE = 'LAYOUT.SET_TITLE',
  SET_ARTIST = 'LAYOUT.SET_ARTIST',
  SET_DRAGGABLE = 'LAYOUT.SET_DRAGGABLE',
}

export enum Palette {
  DARK = 'dark',
  DEVICE = 'device',
  LIGHT = 'light',
}

export const initialState: LayoutState = { palette: Palette.DEVICE, draggable: false, title: '', artist: '' };
