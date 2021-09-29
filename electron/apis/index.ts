import { BrowserWindow } from 'electron';
import { v4 as uuid } from 'uuid';

import { Info } from '../types';
import { timeTagToTimestamp } from '../utils/parse';
import { timeTagRegex, filterRegex } from '../utils/regex';

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
(async () => {
  await kuroshiro.init(kuromojiAnalyzer);
})();

export const startMusic = async (win: BrowserWindow, data: Info) => {
  const lyricRes = await Promise.all([searchQQ(data), search163(data)]);
  const filteredLyrics = lyricRes
    .flat()
    .filter((lyric) => lyric?.length && timeTagRegex.test(lyric));
  const lyrics = await Promise.all(filteredLyrics.map(async (lyric) => {
    const ret = await Promise.resolve(lyric.split('\n').reduce(async (arr: Row[], row: string) => {
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
    }, []));
    return ret;
  }));
  win.webContents.send('MUSIC.START_MUSIC', lyrics.map((lyric) => ({ ...data, lyric })));
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

export const openPreference = (win: BrowserWindow) => {
  win.webContents.send('LAYOUT.SET_PREFERENCE', '');
};
