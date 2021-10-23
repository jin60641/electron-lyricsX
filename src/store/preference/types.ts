export interface PreferenceState {
  draggable: boolean;
  player: Player;
  code: string;
}

export type LocaleState = {
  code: string;
};

export enum Player {
  CHROME = 'Chrome',
  ITUNES = 'ITunes',
  CHROME_EXTENSION = 'ChromeExtension',
}

export enum Actions {
  SET_DRAGGABLE = 'PREFERENCE.SET_DRAGGABLE',
  SET_PLAYER = 'PREFERENCE.SET_PLAYER',
  SET_LOCALE = 'PREFERENCE.LOCALE.SET_LOCALE',
}

export const initialState: PreferenceState = {
  draggable: false,
  player: Player.CHROME,
  code: 'en',
};
