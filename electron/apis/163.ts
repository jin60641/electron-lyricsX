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
  if (!res?.data?.lrc?.lyric) {
    return;
  }
  return {
    ...info,
    lyric: res.data.lrc.lyric,
  } as LyricResponse;
};

const searchMusic = async (info: LyricRequest) => {
  const res = await axios.get('https://c.y.qq.com/soso/fcgi-bin/client_search_cp', {
    params: {
      offset: 0,
      limit: 10,
      type: 1,
      s: `${info.artist} - ${info.name}`,
    },
  });
  if (!res?.data?.results?.songs?.length) {
    return [];
  }
  const infos: LyricResponse[] = res.data.results.songs.map(({
    id,
    name,
    artists,
  }: { id: string, name: string, artists: { name: string }[] }) => ({

    id,
    name,
    artist: artists?.[0].name,
  }));
  const lyricInfos = await Promise.all(infos.map(searchLyric));

  return lyricInfos.filter((lyric) => !!lyric) as LyricResponse[];
};

export default searchMusic;
