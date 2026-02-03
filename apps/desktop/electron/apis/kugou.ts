import { LyricFormat } from '@repo/types';
import { LyricRequest, LyricResponse } from '../types';
import axios from '../utils/axios';
import { makeKeyword } from '../utils/common';
import { decodeKrc } from '../utils/parse';

export interface KugouLyricRequest extends LyricResponse {
  accesskey: string;
}

export interface KugouLyricResponse {
  status: number;
  info: string;
  content: string;
  fmt: string;
}

export interface KugouSearchResponse {
  status: number;
  info: string;
  candidates: {
    id: string;
    accesskey: string;
    duration: number;
    uid: string;
    song: string;
    singer: string;
  }[];
}

const searchLyric: (info: KugouLyricRequest) => Promise<LyricResponse> = async ({
  accesskey,
  ...info
}) => {
  const res = await axios.get<KugouLyricResponse>('http://lyrics.kugou.com/download', { params: { ver: 1, client: 'pc', ...info, accesskey } });
  if (res.data?.status !== 200 || res.data?.info !== 'OK') {
    return info;
  }
  if (res.data.fmt === 'krc') {
    return {
      ...info,
      lyric: decodeKrc(Buffer.from(res.data.content, 'base64')).toString(),
    };
  }
  return {
    ...info,
    lyric: res.data.content,
  };
};

const searchMusic = async (data: LyricRequest): Promise<LyricResponse[]> => {
  const res = await axios.get<KugouSearchResponse>('http://lyrics.kugou.com/search', {
    params: {
      offset: 0,
      limit: 10,
      ver: 1,
      man: 'yes',
      client: 'pc',
      keyword: makeKeyword(data),
      duration: data.duration,
    },
  }).catch(() => null);
  if (res?.data?.status !== 200 || res?.data?.info !== 'OK') {
    return [];
  }
  const songs = res?.data.candidates;
  if (!songs?.length) {
    return [];
  }
  const infos: KugouLyricRequest[] = songs.map(({
    id,
    accesskey,
    song: name,
    singer: artist,
  }) => ({
    id,
    name,
    artist,
    accesskey,
    lyric: '',
    source: 'kugou',
    format: LyricFormat.KRC,
    hasTlit: false,
  }));
  const lyricInfos = await Promise.all(infos.map(searchLyric));
  return lyricInfos.filter((lyricInfo) => !!lyricInfo?.lyric);
};

export default searchMusic;
