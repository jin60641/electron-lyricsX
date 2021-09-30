export interface LayoutState {
  palette: Palette;
}

export enum Actions {
  SET_PALETTE = 'LAYOUT.SET_PALETTE',
}

export enum Palette {
  DARK = 'dark',
  DEVICE = 'device',
  LIGHT = 'light',
}

export const initialState: LayoutState = { palette: Palette.DEVICE };