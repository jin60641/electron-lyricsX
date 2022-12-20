import { LyricFormat } from '../../types';
import { LyricRequest, LyricResponse } from '../types';
import axios from '../utils/axios';
import { makeKeyword } from '../utils/common';

interface I163SearchResponse {
  result: {
    songs: {
      id: string;
      name: string;
      ar: { name: string }[];
    }[],
  }
}

const searchLyric: (info: LyricResponse) => Promise<LyricResponse> = async (info) => {
  const res = await axios.get('https://music.163.com/api/song/media', { params: { id: info.id } });
  if (res?.data?.code !== 200 || !res?.data?.lyric) {
    return info;
  }
  return {
    ...info,
    lyric: res.data.lyric,
  };
};

const searchMusic = async (data: LyricRequest) => {
  const res = await axios.get<I163SearchResponse>('https://music.163.com/api/cloudsearch/pc', {
    params: {
      type: 1,
      offset: 0,
      limit: 10,
      s: makeKeyword(data),
    },
  });
  const songs = res?.data?.result?.songs;
  if (!songs) {
    return [];
  }
  const infos: LyricResponse[] = songs.map(({
    id,
    name,
    ar: [{ name: artist }],
  }) => ({
    id,
    name,
    artist,
    source: '163',
    format: LyricFormat.LRC,
    lyric: '',
  }));
  const lyricInfos = await Promise.all(infos.map(searchLyric));
  return lyricInfos.filter((lyricInfo) => !!lyricInfo?.lyric);
};

export default searchMusic;
