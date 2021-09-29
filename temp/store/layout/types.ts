export interface LayoutState {
  alert: AlertOption,
  search: boolean,
  palette: Palette;
  preference?: PreferenceState,
}

export enum PreferenceState {
  theme = 'theme',
  language = 'language',
}

export enum Actions {
  MAKE_ALERT = 'LAYOUT.MAKE_ALERT',
  DISMISS_ALERT = 'LAYOUT.DISMISS_ALERT',
  SET_SEARCH = 'LAYOUT.SET_SEARCH',
  SET_PALETTE = 'LAYOUT.SET_PALETTE',
  SET_PREFERENCE = 'LAYOUT.SET_PREFERENCE',
}

export enum Palette {
  DARK = 'dark',
  DEVICE = 'device',
  LIGHT = 'light',
}

export const initialState: LayoutState = {
  alert: {
    message: '',
    type: null,
  },
  search: false,
  preference: undefined,
  palette: Palette.DEVICE,
};

export interface AlertOption {
  type: AlertType | null,
  message: string,
}

export enum AlertType {
  info = 'info',
  error = 'error',
}
