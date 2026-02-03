import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LayoutState {
  palette: Palette;
  lineCount: number;
  fontSize: number;
  fontColor: string;
  fontOpacity: number;
  textShadowSize: number;
  textShadowColor: string;
  textShadowOpacity: number;
  backgroundColor: string;
  backgroundOpacity: number;
  progressColor: string;
  progressOpacity: number;
}

export enum Palette {
  DARK = 'dark',
  DEVICE = 'device',
  LIGHT = 'light',
}

export type WindowSize = { width: number; height: number };
export type DraggablePayload = { draggable: boolean };

export const layoutInitialState: LayoutState = {
  palette: Palette.DEVICE,
  lineCount: 2,
  fontSize: 28,
  fontColor: '#ffffff',
  fontOpacity: 1,
  textShadowSize: 28,
  textShadowColor: '#00ffff',
  textShadowOpacity: 0.68,
  backgroundColor: '#000000',
  backgroundOpacity: 0.6,
  progressColor: '#25f4d1',
  progressOpacity: 0.8,
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState: layoutInitialState,
  reducers: {
    setLayout: (state, action: PayloadAction<LayoutState>) => {
      Object.assign(state, action.payload);
    },
    closePreference: (state) => state,
    resizeWindow: (state, action: PayloadAction<WindowSize>) => {
      void action.payload;
      return state;
    },
    changeDraggable: (state, action: PayloadAction<DraggablePayload>) => {
      void action.payload;
      return state;
    },
  },
});

export const layoutActions = layoutSlice.actions;
export const layoutReducer = layoutSlice.reducer;
