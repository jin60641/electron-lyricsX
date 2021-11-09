import { BrowserWindow } from 'electron';
import { v4 as uuid } from 'uuid';

import { Info, Player, LyricResponse } from '../types';
import { timeTagToTimestamp } from '../utils/parse';
import { filterRegex, timeTagRegex } from '../utils/regex';

import search163 from './163';
import searchQQ from './qq';

interface Row {
  timestamp: string,
  time: number,
  text: string,
  id: ReturnType<typeof uuid>,
}

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
export const getLyricRes = async (data: Info): Promise<[LyricResponse[], LyricResponse[]]> => {
  const lyricRes = await Promise.all([searchQQ(data), search163(data)]);
  return lyricRes;
};
/**
 * 가사 검색 결과를 받아서 Row 데이터 변환 결과를 반환합니다.
 * @param {LyricResponse[]} filteredLyrics 조건에 맞게 필터링 된 데이터
 */
export const parseRowData = async (filteredLyrics: LyricResponse[]) => {
  const lyrics = await Promise.all(filteredLyrics.map(async ({ lyric, ...info }) => {
    const ret = await Promise.resolve((lyric.split('\n')).reduce(async (arr: Promise<Row[]>, row: string) => {
      const matches = row.match(timeTagRegex);
      if (!matches) {
        return arr;
      }
      if (filterRegex.test(row)) {
        return arr;
      }
      const [timestamp] = matches;
      const text = row.replace(timestamp, '').replace('/\r/', '');

      const item: Row = {
        timestamp,
        time: timeTagToTimestamp(timestamp),
        text: text ? await kuroshiro.convert(text, { mode: 'furigana', to: 'hiragana' }) as string : '',
        id: uuid(),
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
  const filteredLyrics = lyricRes
    .reduce((a, b) => [...a.map((e) => ({ ...e, title: e.name, source: '163' })), ...b.map((e) => ({ ...e, title: e.name, source: 'QQ' }))]);

  const lyrics = await parseRowData(filteredLyrics);
  return lyrics;
};
export const searchMusic = async (win: BrowserWindow, data: Info) => {
  const lyrics = await getLyrics(data);
  win.webContents.send('MUSIC.SEARCH_MUSIC', lyrics);
};
export const startMusic = async (win: BrowserWindow, data: Info) => {
  const lyrics = await getLyrics(data);
  win.webContents.send('MUSIC.START_MUSIC', lyrics);
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
