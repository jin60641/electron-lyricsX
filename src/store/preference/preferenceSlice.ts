// eslint-disable-next-line import/no-extraneous-dependencies
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { createAsyncAction } from 'typesafe-actions';

import {
  // eslint-disable-next-line max-len
  Actions, initialState, PreferenceState, SetDraggablePayload, SetPlayerRequestPayload, SetPlayerSuccessPayload,
} from './types';

const persistConfig = {
  key: 'preference',
  storage: window.bridge.storage,
};

const setPlayer = createAsyncAction(
  Actions.SET_PLAYER_REQUEST,
  Actions.SET_PLAYER_SUCCESS,
  Actions.SET_PLAYER_FAILURE,
)<SetPlayerRequestPayload, SetPlayerSuccessPayload, void>();

const preferenceSlice = createSlice({
  name: 'preference',
  initialState,
  reducers: {
    setDraggable: (state, action: PayloadAction<SetDraggablePayload>) => ({
      ...state,
      draggable: action.payload,
    }),
    setLocale: (state, action: PayloadAction<PreferenceState['locale']>) => ({
      ...state,
      code: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(`${setPlayer.success}`, (state, action: PayloadAction<PreferenceState['player']>) => ({
        ...state,
        player: action.payload,
      }));
  },
});

export const preferenceActions = { ...preferenceSlice.actions, setPlayer };
export const preferenceReducer = preferenceSlice.reducer;

export default persistReducer(persistConfig, preferenceReducer);
