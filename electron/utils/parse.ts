import { v4 as uuid } from 'uuid';
import zlib from 'zlib';

import {
  KrcRow, KrcWord, LrcRow, LyricFormat, Row,
} from '../../types';
import { LyricResponse } from '../types';

import {
  filterRegex,
  krcLineRegex,
  krcTimeTagRegex,
  krcWordRegex,
  lrcTimeTagRegex,
} from './regex';

const Kuroshiro = require('kuroshiro').default;
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');

const kuroshiro = new Kuroshiro();
const kuromojiAnalyzer = new KuromojiAnalyzer();

export const checkAnalyzer = async () => {
  if (kuroshiro.analyzer) {
    return;
  }
  await kuroshiro.init(kuromojiAnalyzer);
};

checkAnalyzer();

const lrcTimeTagToTime = (str: string) => {
  const matches = str.match(lrcTimeTagRegex);
  if (!matches) {
    return 0;
  }
  const [ms = 0, ss = 0, mm = 0] = matches
    .slice(1, 4)
    .filter((data) => data !== undefined)
    .reverse()
    .map(Number);

  return mm * 60 + ss + ms * (10 ** -(`${ms}`.length));
};

const addFuriganaText = (text: string) => kuroshiro.convert(text, { mode: 'furigana', to: 'hiragana' });

const parseWords = async (str: string): Promise<KrcWord[]> => {
  const matches = [...str.matchAll(krcWordRegex)];
  if (!matches) {
    return [];
  }
  const words = await Promise.all(matches.map(async ([_sub, _offset, duration, _, text]) => ({
    text: await addFuriganaText(text),
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

const parseKrcRow = async (row: string): Promise<KrcRow | void> => {
  const matches = row.match(krcLineRegex);
  if (!matches) return;
  const timeTags = matches[1].match(krcTimeTagRegex);
  if (!timeTags) return;
  const [time, duration] = timeTags.slice(1, 2).map((num) => parseFloat(num) / 1000);
  const body = matches[3];
  return {
    id: uuid(),
    format: LyricFormat.KRC,
    time,
    duration,
    words: await parseWords(body),
  };
};

const parseLrcRow = async (row: string): Promise<LrcRow | void> => {
  const matches = row.match(lrcTimeTagRegex);
  if (!matches) {
    return;
  }
  const [timestamp] = matches;
  const text = row.replace(timestamp, '').replace('/\r/', '');
  return {
    id: uuid(),
    format: LyricFormat.LRC,
    time: lrcTimeTagToTime(timestamp),
    timestamp,
    text: await addFuriganaText(text),
  };
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
      let item;
      switch (info.format) {
        case LyricFormat.KRC: {
          item = await parseKrcRow(row);
          break;
        }
        case LyricFormat.LRC: {
          item = await parseLrcRow(row);
          break;
        }
        default: {
          break;
        }
      }
      if (!item) {
        return arr;
      }
      return (await arr).concat([item]);
    }, Promise.resolve([])));
    return {
      ...info,
      lyric: ret,
    };
  }));
  return lyrics;
};

export const KRC_ENCODE_KEY = Buffer.from(new Uint8Array([
  64, 71, 97, 119, 94, 50, 116, 71,
  81, 54, 49, 45, 206, 210, 110, 105,
]));

export const decodeKrc = (content: Buffer): Buffer => {
  const diff = 4;
  const buffer = Buffer.alloc(content.length - diff);
  for (let i = diff; i < content.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    buffer[i - diff] = content[i] ^ KRC_ENCODE_KEY[(i - diff) % 16];
  }
  return zlib.unzipSync(buffer);
};
