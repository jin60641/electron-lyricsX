import type { Music } from '@repo/types';
import { MUSIC_ACTIONS } from '@repo/types';

export interface MusicState {
  list: Music[];
  lastSelected: number;
  isPlaying: boolean;
  currentOffset: number;
  globalOffset: number;
  name?: string;
  artist?: string;
}

export { MUSIC_ACTIONS as Actions };

export const initialState: MusicState = {
  list: [],
  lastSelected: 0,
  isPlaying: false,
  currentOffset: 0,
  globalOffset: -0.5,
};

export interface TranslateLyricRequestPayload {
  lyric: Music['lyric'];
  locale: string;
}

export type SearchMusicRequestPayload = Pick<Music, 'name' | 'artist'>;
export type SearchMusicSuccessPayload = MusicState['list'];

export type StartMusicPayload = SearchMusicRequestPayload;
