export interface SearchState {
  title: string;
  artist: string;
}

export enum Actions {
  SET_TITLE = 'LAYOUT.SET_TITLE',
  SET_ARTIST = 'LAYOUT.SET_ARTIST',
}

export const initialState: SearchState = {
  title: '',
  artist: '',
};
