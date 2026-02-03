import { LyricFormat } from '@repo/types';
import { LyricRequest, LyricResponse } from '../types';
import axios from '../utils/axios';
import { makeKeyword } from '../utils/common';

export interface LrclibLyricItem {
  id: number,
  name: string,
  trackName: string,
  artistName: string,
  albumName: string,
  duration: number,
  instrumental: boolean,
  plainLyrics: string,
  syncedLyrics: string,
}

export interface LrclibLyricRequest {
  duration: number,
  artist_name: string,
  track_name: string,
}

export type LrclibLyricResponse = LrclibLyricItem[];

const searchMusic = async (data: LyricRequest): Promise<LyricResponse[]> => {
  const params: LrclibLyricRequest = {
    duration: data.duration,
    track_name: data.name,
    artist_name: data.artist,
  };
  const res = await axios.get<LrclibLyricResponse>('https://lrclib.net/api/search', { params }).catch(() => null);
  if (res?.status !== 200 || !res?.data) {
    return [];
  }
  return res.data.map((data) => ({
    format: LyricFormat.LRC,
    lyric: data.syncedLyrics,
    id: data.id,
    name: data.trackName,
    artist: data.artistName,
    source: 'lrclib',
    hasTlit: false,
  }));
};

export default searchMusic;
