export enum Actions {
  SET_LOCALE = 'LOCALE.SET_LOCALE',
  SET_PLAYER = 'LOCALE.SET_PLAYER',
}

export type LocaleState = {
  code: string;
  player: Player;
};

export enum Player {
  CHROME = 'chrome',
  ITUNES = 'itunes',
  CHROME_EXTENSION = 'chromeExtension',
}

export const initialState: LocaleState = { code: 'en', player: Player.CHROME };
