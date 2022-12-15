import { timeTagRegex } from './regex';

export const timeTagToTimestamp = (str: string) => {
  const matches = str.match(timeTagRegex);
  if (!matches) {
    return 0;
  }
  const [ms = 0, ss = 0, mm = 0] = matches
    .slice(1, 4)
    .filter((data) => data !== undefined)
    .reverse()
    .map(Number);

  return mm * 60 + ss + ms * (10 ** -(`${ms}`.length));
};
