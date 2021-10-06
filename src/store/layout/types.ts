export interface LayoutState {
  palette: Palette;
  draggable: Draggable;
}

export enum Actions {
  SET_PALETTE = 'LAYOUT.SET_PALETTE',
  CLOSE_PREFERENCE = 'LAYOUT.CLOSE_PREFERENCE',

  SET_DRAGGABLE = 'LAYOUT.SET_DRAGGABLE',
}

export enum Palette {
  DARK = 'dark',
  DEVICE = 'device',
  LIGHT = 'light',
}

export enum Draggable {
  ON = 'ON',
  OFF = 'OFF',
}

export const initialState: LayoutState = { palette: Palette.DEVICE, draggable: Draggable.ON };
