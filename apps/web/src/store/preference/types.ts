import { PREFERENCE_ACTIONS } from '@repo/types';

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

export { PREFERENCE_ACTIONS as Actions };

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
