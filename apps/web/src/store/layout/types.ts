import { LAYOUT_ACTIONS } from '@repo/types';

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

export { LAYOUT_ACTIONS as Actions };

export enum Palette {
  DARK = 'dark',
  DEVICE = 'device',
  LIGHT = 'light',
}

export const initialState: LayoutState = {
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
