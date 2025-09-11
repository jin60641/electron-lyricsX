export * from '../../types';
import type { Music } from '../../types';

export interface LyricRequest {
  name: string;
  artist: string;
  duration: number;
}

export interface LyricResponse extends Omit<Music, 'lyric'> {
  lyric: string;
}

import * as ClientEvent from './ClientEvent';
export { ClientEvent };
