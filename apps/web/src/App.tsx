import React, { lazy, useMemo, Suspense } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useSelector } from 'react-redux';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';

import Draggable from '@renderer/components/Draggable';
import { Route as TRoute } from '@renderer/constants/routes';
import { overrides, palettes } from '@renderer/constants/theme';
import { Palette } from '@renderer/store/layout/types';
import { RootState } from '@renderer/store/types';

const paletteSelector = ({ layout: { palette } }: RootState) => palette;

const routes: TRoute[] = [
  {
    key: '',
    component: lazy(() => import('@renderer/pages/Main')),
  },
  {
    key: 'preference/*',
    component: lazy(() => import('@renderer/pages/Preference')),
  },
  {
    key: 'search',
    component: lazy(() => import('@renderer/pages/Search')),
  },
];

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const palette = useSelector(paletteSelector);

  const paletteMode = useMemo<'light' | 'dark'>(() => {
    if (palette === Palette.DEVICE) {
      return prefersDarkMode ? 'dark' : 'light';
    }
    return palette as 'light' | 'dark';
  }, [prefersDarkMode, palette]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: paletteMode,
          ...(palettes[paletteMode] || {}),
        },
        components: overrides, // MUI v5에서는 overrides가 components로 변경됨
      }),
    [paletteMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Draggable />
      <Suspense fallback={<div>Loading...</div>}>
        <Router>
          <Routes>
            {routes.map(({ key, component: Component }) => (
              <Route key={key} path={`/${key}`} element={<Component />} />
            ))}
          </Routes>
        </Router>
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
