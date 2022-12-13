import axios from '../utils/axios';

import { LyricRequest, LyricResponse } from '../types';

const searchLyric: (info: LyricResponse) => Promise<LyricResponse | void> = async (info) => {
  const res = await axios.get('https://music.163.com/api/song/media', {
    params: {
      id: info.id,
    },
  });
  console.log(res.data);
  if (res?.data?.code !== 200 || !res?.data?.lyric) {
    return;
  }
  return {
    ...info,
    lyric: res.data.lyric,
    source: '163',
  } as LyricResponse;
};

const searchMusic = async (data: LyricRequest) => {
  const res = await axios.get('https://music.163.com/api/cloudsearch/pc', {
    params: {
      type: 1,
      offset: 0,
      limit: 10,
      s: `${data.artist} - ${data.name}`,
    },
  });
  const songs = res?.data?.result?.songs;
  if (!songs) {
    return [];
  }
  const infos: LyricResponse[] = songs.reduce((arr: LyricResponse[], {
    id,
    name,
    ar: [{ name: artist }],
  }: any) => [
    ...arr,
    {
      id,
      name,
      artist,
    },
  ], [] as LyricResponse[]);
  const lyricInfos = await Promise.all(infos.map(searchLyric));
  return lyricInfos.filter((lyric) => !!lyric) as LyricResponse[];
};

export default searchMusic;
