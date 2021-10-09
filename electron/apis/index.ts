import { BrowserWindow } from 'electron';
import { v4 as uuid } from 'uuid';

import { Info, LyricRequest } from '../types';
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

export const searchMusic = async (win: BrowserWindow, data: LyricRequest) => {
  const lyricRes = await Promise.all([searchQQ(data), search163(data)]);
  const filteredLyrics = lyricRes.reduce((a, b) => [...a.map((e) => ({ ...e, title: e.name, source: '163' })), ...b.map((e) => ({ ...e, title: e.name, source: 'QQ' }))]);
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
  win.webContents.send('MUSIC.SEARCH_MUSIC', lyrics);
};
export const startMusic = async (win: BrowserWindow, data: Info) => {
  try {
    await checkAnalyzer();
  } catch (e) {
    // error logging
  }
  const lyricRes = await Promise.all([searchQQ(data), search163(data)]);
  const filteredLyrics = lyricRes
    .reduce((a, b) => [...a, ...b])
    .filter(({ lyric }) => lyric?.length && timeTagRegex.test(lyric));
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
