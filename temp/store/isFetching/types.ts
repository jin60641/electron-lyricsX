import { Actions as LayoutActions, Actions as MusicActions } from 'store/layout/types';

export const Actions = [LayoutActions, MusicActions];

export type IsFetchingState = {
  [key: string]: boolean,
};

export type Middleware = (state: IsFetchingState) => IsFetchingState;

export const initialState: IsFetchingState = {};
