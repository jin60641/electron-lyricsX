import { BrowserWindow } from 'electron';
import { v4 as uuid } from 'uuid';

import {
  KrcRow, KrcWord, LrcRow, Row,
} from '../../types/root';
import { Info, LyricResponse, Player } from '../types';
import { lrcTimeTagToTime } from '../utils/parse';
import {
  filterRegex,
  krcLineRegex,
  krcTimeTagRegex,
  krcWordRegex,
  lrcTimeTagRegex,
} from '../utils/regex';

import search163 from './163';
import searchKugou from './kugou';

const Kuroshiro = require('kuroshiro').default;
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');

const kuroshiro = new Kuroshiro();
const kuromojiAnalyzer = new KuromojiAnalyzer();

const checkAnalyzer = async () => {
  if (kuroshiro.analyzer) {
    return;
  }
  await kuroshiro.init(kuromojiAnalyzer);
};

checkAnalyzer();

/**
 * 검색 인자를 받아서 가사 검색 결과를 반환합니다.
 * @param {Info} data 검색 인자
 */
export const getLyricRes = async (data: Info): Promise<LyricResponse[]> => {
  const lyricRes = await Promise.all([
    searchKugou(data),
    search163(data),
  ]);
  return lyricRes.flat();
};

const parseWords = async (str: string): Promise<KrcWord[]> => {
  const matches = [...str.matchAll(krcWordRegex)];
  if (!matches) {
    return [];
  }
  const words = await Promise.all(matches.map(async ([_sub, _offset, duration, _, text]) => ({
    text: text ? await kuroshiro.convert(text, { mode: 'furigana', to: 'hiragana' }) as string : '',
    duration: parseInt(duration, 10) / 1000,
    time: 0,
  })));
  return words.reduce((arr, word, i) => [
    ...arr,
    {
      ...word,
      time: i ? (arr[i - 1].time + arr[i - 1].duration) : 0,
    },
  ], [] as KrcWord[]);
};

/**
 * 가사 검색 결과를 받아서 Row 데이터 변환 결과를 반환합니다.
 * @param {LyricResponse[]} filteredLyrics 조건에 맞게 필터링 된 데이터
 */
export const parseRowData = async (filteredLyrics: LyricResponse[]) => {
  const lyrics = await Promise.all(filteredLyrics.map(async ({ lyric, ...info }) => {
    const ret = await Promise.resolve((lyric.split('\n')).reduce(async (arr: Promise<Row[]>, row: string) => {
      if (filterRegex.test(row)) {
        return arr;
      }
      if (info.source === 'kugou') {
        const matches = row.match(krcLineRegex);
        if (!matches) return arr;
        const timeTags = matches[1].match(krcTimeTagRegex);
        if (!timeTags) {
          return arr;
        }
        const [time, duration] = timeTags.slice(1, 2).map((num) => parseFloat(num) / 1000);
        const body = matches[3];
        const item: KrcRow = {
          time,
          duration,
          id: uuid(),
          words: await parseWords(body),
          format: 'krc',
        };
        return (await arr).concat([item]);
      }
      const matches = row.match(lrcTimeTagRegex);
      if (!matches) {
        return arr;
      }
      const [timestamp] = matches;
      const text = row.replace(timestamp, '').replace('/\r/', '');
      const item: LrcRow = {
        time: lrcTimeTagToTime(timestamp),
        timestamp,
        id: uuid(),
        text: text ? await kuroshiro.convert(text, { mode: 'furigana', to: 'hiragana' }) as string : '',
        format: 'lrc',
      };
      return (await arr).concat([item]);
    }, Promise.resolve([])));
    return {
      ...info,
      lyric: ret,
    };
  }));
  return lyrics;
};
/**
 * 검색 인자를 받아서 변환이 완료된 가사 데이터를 반환합니다.
 * @param data 검색 인자
 */
export const getLyrics = async (data: Info) => {
  try {
    await checkAnalyzer();
  } catch (e) {
    // error logging
  }
  const lyricRes = await getLyricRes(data);

  const lyrics = await parseRowData(lyricRes);
  return lyrics;
};
export const searchMusic = async (win: BrowserWindow, data: Info) => {
  const lyrics = await getLyrics(data);
  win.webContents.send('MUSIC.SEARCH_MUSIC#SUCCESS', lyrics);
};
export const startMusic = async (win: BrowserWindow, data: Info) => {
  const { name, artist } = data;
  win.webContents.send('MUSIC.START_MUSIC', {
    name,
    artist,
  });
  const lyrics = await getLyrics(data);
  win.webContents.send('MUSIC.SEARCH_MUSIC#SUCCESS', lyrics);
};

export const seekMusic = async (win: BrowserWindow, data: Info) => {
  win.webContents.send('MUSIC.SEEK_MUSIC', data);
};

export const pauseMusic = async (win: BrowserWindow) => {
  win.webContents.send('MUSIC.PAUSE_MUSIC', '');
};

export const stopMusic = async (win: BrowserWindow) => {
  win.webContents.send('MUSIC.STOP_MUSIC', '');
};

export const setPlayer = async (win: BrowserWindow, data: Player) => {
  win.webContents.send('PREFERENCE.SET_PLAYER#SUCCESS', data);
};
