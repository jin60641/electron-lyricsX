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

const searchMusic = async (info: Info) => {
  const res = await axios.get('https://c.y.qq.com/soso/fcgi-bin/client_search_cp', {
    params: {
      offset: 0,
      limit: 10,
      type: 1,
      s: `${info.artist} - ${info.name}`,
    },
  });
  const ids: string[] = res?.data?.results?.songs?.map(({ id }: { id: string }) => id);
  let lyrics: string[] = [];
  if (ids) {
    const lyricRes = await Promise.all(ids.map(searchLyric));
    lyrics = lyricRes
      .filter(({ data }) => !!data?.lrc?.lyric)
      .map(({ data: { lrc: { lyric } } }) => lyric);
  }
  return lyrics;
};

export default searchMusic;
