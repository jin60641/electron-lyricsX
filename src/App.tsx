import React, { useMemo } from 'react';

import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useSelector } from 'react-redux';
import {
  Redirect,
  Route,
  HashRouter as Router,
  Switch,
} from 'react-router-dom';

import Alert from 'components/Alert';
import Draggable from 'components/Draggable';
import routes from 'constants/routes';
import { overrides, palettes } from 'constants/theme';
import Main from 'pages/Main';
import Preference from 'pages/Preference';
import Search from 'pages/Search';
import { Palette } from 'store/layout/types';
import { RootState } from 'store/types';

import 'vendor';

const useStyles = makeStyles({
  root: { display: 'flex' },
  content: { flexGrow: 1 },
});

const paletteSelector = ({ layout: { palette } }: RootState) => palette;

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const palette = useSelector(paletteSelector);
  const classes = useStyles();

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
      <Router>
        <main className={classes.content}>
          <Switch>
            <Route
              path='/'
              exact
              component={Main}
            />
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
            <Redirect to='/' />
          </Switch>
        </main>
      </Router>
      <Alert />
      <Preference />
      <Search />
    </ThemeProvider>
  );
};

export default App;
