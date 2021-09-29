import { Theme } from '@material-ui/core/styles';

export const overrides: Theme['overrides'] = { MuiButton: { root: { textTransform: 'none' } } };

export const palettes = {
  dark: {
    primary: {
      light: '#ffac33',
      main: '#ff9800',
      dark: '#b26a00',
    },
    text: { disabled: '#424242' },
    grey: {
      100: '#141414',
      200: '#3f3f3f',
      300: '#5b5b5b',
      400: '#6d6d6d',
      500: '#825252',
      600: '#a6a6a6',
      700: '#b0b0b0',
      800: '#c8c8c8',
      900: '#d3d3d3',
    },
  },
  light: {},
};
