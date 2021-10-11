export interface SearchState {
  title: string;
  artist: string;
}

export enum Actions {
  SET_TITLE = 'SEARCH.SET_TITLE',
  SET_ARTIST = 'SEARCH.SET_ARTIST',
}

export const initialState: SearchState = {
  title: '',
  artist: '',
};
