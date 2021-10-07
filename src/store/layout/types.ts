export interface LayoutState {
  palette: Palette;

}

export enum Actions {
  SET_PALETTE = 'LAYOUT.SET_PALETTE',
  CLOSE_PREFERENCE = 'LAYOUT.CLOSE_PREFERENCE',

  CLOSE_SEARCH_MODAL = 'LAYOUT.CLOSE_SEARCH_MODAL',
}

export enum Palette {
  DARK = 'dark',
  DEVICE = 'device',
  LIGHT = 'light',
}

export const initialState: LayoutState = { palette: Palette.DEVICE };
