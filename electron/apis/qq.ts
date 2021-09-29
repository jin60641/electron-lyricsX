import axios from 'axios';

import { Info } from '../types';

const searchLyric = async (mid: string) => axios.get('https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg', {
  params: {
    songmid: mid,
    g_tk: 5381,
    nobase64: 1,
    format: 'json',
    platform: 'yqq.json',
    needNewCode: 0,
  },
  headers: { referer: 'https://c.y.qq.com/portal/player.html' },
});

const searchMusic = async (data: Info) => {
  const res = await axios.get('https://c.y.qq.com/soso/fcgi-bin/client_search_cp', {
    params: {
      new_json: 1,
      catZhida: 1,
      inCharset: 'utf8',
      outCharset: 'utf8',
      format: 'json',
      w: `${data.artist} ${data.name}`,
    },
  });
  const songs = res?.data?.data?.song?.list;
  let lyrics = [];
  if (songs) {
    const ids = songs.reduce((arr: string[], { mid, file: { media_mid: mmid } }: any) => [
      ...arr,
      mid,
      mmid,
    ], [] as string[]);
    const lyricRes = await Promise.all(ids.map(searchLyric));
    lyrics = lyricRes
      .filter(({ data: { retcode } }: any) => retcode === 0)
      .map(({ data: { lyric } }: any) => lyric);
  }
  return lyrics;
};

export default searchMusic;
