export interface PreferenceState {
  draggable: boolean;
  player: Player;
  locale: LocaleState,
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
  SET_LOCALE = 'PREFERENCE.LOCALE.SET_LOCALE',
  SET_PLAYER_REQUEST = 'PREFERENCE.SET_PLAYER#REQUEST',
  SET_PLAYER_SUCCESS = 'PREFERENCE.SET_PLAYER#SUCCES',
  SET_PLAYER_FAILURE = 'PREFERENCE.SET_PLAYER#FAILURE',
}

export const initialState: PreferenceState = {
  draggable: false,
  player: Player.CHROME,
  locale: { code: 'en' },
};

export type SetDraggablePayload = PreferenceState['draggable'];
export type SetPlayerRequestPayload = PreferenceState['player'];
export type SetPlayerSuccessPayload = SetPlayerRequestPayload;
