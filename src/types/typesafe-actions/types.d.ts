import { RootAction, RootState } from '../../store/types';

declare module 'typesafe-actions' {
  interface Types {
    RootState: RootState,
    RootAction: RootAction,
  }
}
