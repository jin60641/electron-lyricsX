import React, { lazy, useMemo } from 'react';

import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useSelector } from 'react-redux';
import {
  Route,
  HashRouter as Router,
  Switch,
} from 'react-router-dom';

import Draggable from 'components/Draggable';
import { Route as TRoute } from 'constants/routes';
import { overrides, palettes } from 'constants/theme';
import { Palette } from 'store/layout/types';
import { RootState } from 'store/types';

const paletteSelector = ({ layout: { palette } }: RootState) => palette;

const routes: TRoute[] = [{
  key: '',
  component: lazy(() => import('pages/Main')),
  exact: true,
}, {
  key: 'preference',
  component: lazy(() => import('pages/Preference')),
}, {
  key: 'search',
  component: lazy(() => import('pages/Search')),
}];

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const palette = useSelector(paletteSelector);

  const paletteType = useMemo(() => {
    if (palette === Palette.DEVICE) {
      return prefersDarkMode ? 'dark' : 'light';
    }
    return palette;
  }, [prefersDarkMode, palette]);

  const theme = useMemo(() => createMuiTheme({
    overrides,
    palette: {
      type: paletteType,
      ...(palettes[paletteType]),
    },
  }), [paletteType]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Draggable />
      <React.Suspense fallback={<></>}>
        <Router>
          <Switch>
            {routes.map(({
              key,
              ...props
            }) => (
              <Route
                key={`app-route-${key}`}
                path={`/${key}`}
                {...props}
              />
            ))}
          </Switch>
        </Router>
      </React.Suspense>
      {/* <Preference /> */}
    </ThemeProvider>
  );
};

export default App;
