import axios from 'axios';

import { LyricRequest, LyricResponse } from '../types';

const searchLyric: (info: LyricResponse) => Promise<LyricResponse | void> = async (info) => {
  const res = await axios.get('https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg', {
    params: {
      songmid: info.id,
      g_tk: 5381,
      nobase64: 1,
      format: 'json',
      platform: 'yqq.json',
      needNewCode: 0,
    },
    headers: { referer: 'https://c.y.qq.com/portal/player.html' },
  });
  if (res?.data?.retcode !== 0 || !res?.data?.lyric) {
    return;
  }
  return {
    ...info,
    lyric: res.data.lyric,
  } as LyricResponse;
};

const searchMusic = async (data: LyricRequest) => {
  const res = await axios.get('https://c.y.qq.com/soso/fcgi-bin/client_search_cp', {
    params: {
      new_json: 1,
      catZhida: 1,
      inCharset: 'utf8',
      outCharset: 'utf8',
      format: 'json',
      w: `${data.artist} - ${data.name}`,
    },
  });
  const songs = res?.data?.data?.song?.list;
  if (!songs) {
    return [];
  }
  const infos: LyricResponse[] = songs.reduce((arr: LyricResponse[], {
    name,
    singer,
    mid,
    file: { media_mid: mmid },
  }: any) => [
    ...arr,
    {
      id: mid,
      name,
      artist: singer[0]?.name,
    },
    {
      id: mmid,
      name,
      artist: singer[0]?.name,
    },
  ], [] as LyricResponse[]);
  const lyricInfos = await Promise.all(infos.map(searchLyric));
  return lyricInfos.filter((lyric) => !!lyric) as LyricResponse[];
};

export default searchMusic;
