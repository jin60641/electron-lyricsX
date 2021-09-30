import mainWindow from './main';
import preferenceWindow from './preference';

const createWindows = () => ({
  main: mainWindow(),
  preference: preferenceWindow(),
});

export type Windows = ReturnType<typeof createWindows>;
export default createWindows;
