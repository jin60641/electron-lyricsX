export interface PreferenceState {
  draggable: boolean;
  player: Player;
  locale: LocaleState;
  showFurigana: boolean;
  showTlit: boolean;
}

export type LocaleState = {
  code: string;
};

export enum Player {
  CHROME = 'Chrome',
  ITUNES = 'ITunes',
  SPOTIFY = 'Spotify',
  CHROME_EXTENSION = 'ChromeExtension',
}

export enum Actions {
  SET_DRAGGABLE = 'PREFERENCE.SET_DRAGGABLE',
  SET_LOCALE = 'PREFERENCE.LOCALE.SET_LOCALE',
  SET_PREFERENCE = 'PREFERENCE.SET_PREFERENCE',
  SET_PLAYER_REQUEST = 'PREFERENCE.SET_PLAYER#REQUEST',
  SET_PLAYER_SUCCESS = 'PREFERENCE.SET_PLAYER#SUCCESS',
  SET_PLAYER_FAILURE = 'PREFERENCE.SET_PLAYER#FAILURE',
}

export enum Locale {
  EN = 'en',
  KO = 'ko',
}

export const initialState: PreferenceState = {
  player: Player.CHROME,
  locale: { code: Locale.EN },

  draggable: false,
  showFurigana: true,
  showTlit: true,
};

export type SetPreferencePayload = Partial<PreferenceState>;
export type SetDraggablePayload = PreferenceState['draggable'];
export type SetPlayerRequestPayload = PreferenceState['player'];
export type SetPlayerSuccessPayload = SetPlayerRequestPayload;
