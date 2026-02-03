import mainWindow from './main';
import preferenceWindow from './preference';
import searchWindow from './search';

const createWindows = () => ({
  main: mainWindow(),
  preference: preferenceWindow(),
  search: searchWindow(),
});

export type Windows = ReturnType<typeof createWindows>;
export default createWindows;
