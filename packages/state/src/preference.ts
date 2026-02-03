import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export enum Locale {
  EN = 'en',
  KO = 'ko',
}

export const preferenceInitialState: PreferenceState = {
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

const preferenceSlice = createSlice({
  name: 'preference',
  initialState: preferenceInitialState,
  reducers: {
    setDraggable: (state, action: PayloadAction<SetDraggablePayload>) => {
      state.draggable = action.payload;
    },
    setPreference: (state, action: PayloadAction<SetPreferencePayload>) => {
      Object.assign(state, action.payload);
    },
    setPlayerRequest: (state, action: PayloadAction<SetPlayerRequestPayload>) => {
      void action.payload;
      return state;
    },
    setPlayerSuccess: (state, action: PayloadAction<SetPlayerSuccessPayload>) => {
      state.player = action.payload;
    },
    setPlayerFailure: (state, action: PayloadAction<unknown>) => {
      void action.payload;
      return state;
    },
    setLocale: (state, action: PayloadAction<PreferenceState['locale']>) => {
      state.locale = action.payload;
    },
  },
});

const { setPlayerRequest, setPlayerSuccess, setPlayerFailure, ...baseActions } =
  preferenceSlice.actions;

export const preferenceActions = {
  ...baseActions,
  setPlayer: {
    request: setPlayerRequest,
    success: setPlayerSuccess,
    failure: setPlayerFailure,
  },
};

export const preferenceReducer = preferenceSlice.reducer;
