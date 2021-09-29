export enum Actions {
  SET_LOCALE = 'LOCALE.SET_LOCALE',
}

export type LocaleState = {
  code: string;
};

export const initialState: LocaleState = { code: 'en' };
