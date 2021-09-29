import React from 'react';

import { CssBaseline } from '@material-ui/core';

import Draggable from 'components/Draggable';

import Main from './Main';

const App: React.FC = () => (
  <>
    <CssBaseline />
    <Draggable />
    <Main />
  </>
);

export default App;
