import { v4 as uuid } from 'uuid';
import zlib from 'zlib';

import {
  KrcRow, KrcWord, LrcRow, LyricFormat, Music,
  Row,
} from '../../types';
import { LyricResponse } from '../types';

import { tlit } from './papago';
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
    srcText: text,
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
  const words = await parseWords(body);
  return {
    id: uuid(),
    format: LyricFormat.KRC,
    time,
    duration,
    words,
    srcText: words.map(({ srcText }) => srcText).join(''),
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
    srcText: text,
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
  return lyrics.filter(({ lyric }) => !!lyric?.length);
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

/* eslint-disable no-param-reassign */
export const tlitLyric = async ({ lyric, locale }: { lyric: Music['lyric'], locale: string }) => {
  const srcTexts = lyric.map((row) => {
    if (row.format === LyricFormat.KRC) {
      row.tlitWords = [];
      row.tlits = [];
    }
    return row.srcText;
  }).reduce((arr, srcText) => {
    const target = arr.length - 1;
    const line = `${srcText}\n`;
    if (arr[target].length + srcText.length < 900) {
      arr[target] += line;
    } else {
      arr.push(line);
    }
    return arr;
  }, ['']);

  const promises = srcTexts.map(async (query) => tlit({
    query,
    tlitLang: locale,
  }));

  const tlits = await Promise.all(promises)
    .then((items) => items.map((item) => item?.message?.tlitResult).flat());

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  tlits.reduce(({ texts, arr }, item) => {
    if (!item) {
      return { texts, arr };
    }
    const trimed = item.token.replace('\r', '');
    const index = texts.indexOf(trimed);
    if (index === -1) {
      return { texts, arr };
    }
    let etc = texts.substr(0, index);
    texts = texts.substr(index + trimed.length);

    let target = arr.length - 1;

    const newLineRegex = /(\r\n|\r|\n)/g;
    const newlines = etc.match(newLineRegex);
    if (newlines) {
      for (let i = 0; i < newlines.length; i += 1) {
        const newLineIndex = etc.search(newLineRegex);
        lyric[target].tlitText = arr[target] + etc.substr(0, newLineIndex);
        etc = etc.substr(newLineIndex + newlines[i].length);
        arr.push('');
        target += 1;
      }
      arr[target] = `${item.phoneme} `;
    } else {
      arr[target] += `${etc}${item.phoneme} `;
    }

    const row = lyric[target];
    if (row.format === LyricFormat.KRC) {
      row.tlits?.push(item);
    }

    return { texts, arr };
  }, { texts: srcTexts.join(''), arr: [''] });

  lyric.forEach((row) => {
    if (row.format === LyricFormat.KRC && row.tlits?.length) {
      let tlitArrIndex = 0;
      let wordArrIndex = 0;
      let tlitItemTextIndex = 0;
      let srcText = '';
      let startWordArrIndex = wordArrIndex;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const wordItem = row.words[wordArrIndex];
        const tlitItem = row.tlits[tlitArrIndex];
        const tlitItemText = tlitItem.token.replace('\r', '');
        const c = tlitItemText[tlitItemTextIndex];
        const index = wordItem.srcText.indexOf(c);
        if (index >= 0) {
          if (tlitItemTextIndex === tlitItemText.length - 1) { // 이번 word에서 tlit text 다 찾은거면?
            const left = wordItem.srcText.substr(index + tlitItemText.length);

            tlitArrIndex += 1;
            tlitItemTextIndex = 0;
            srcText += tlitItem.phoneme;
            if (left.length === 0) { // 남은 글자가 없으면?
              const { time } = row.words[startWordArrIndex];
              row.tlitWords?.push({
                time,
                duration: wordItem.duration + wordItem.time - time,
                srcText,
                text: srcText,
              });
              wordArrIndex += 1;
              startWordArrIndex = wordArrIndex;
              srcText = '';
            }
          } else { // 아직 다 못찾았으면?
            tlitItemTextIndex += 1;
          }
        } else { // 이번 word에 tlit 글자가 없으면?
          wordArrIndex += 1; // 다음 word에서 마저 탐색
        }

        if (!(tlitArrIndex < row.tlits.length && wordArrIndex < row.words.length)) {
          // 다 돌았는데 글자가 남았으면?
          if (srcText.length) {
            const { time } = row.words[startWordArrIndex];
            row.tlitWords?.push({
              time,
              duration: wordItem.duration + wordItem.time - time,
              srcText,
              text: srcText,
            });
          }
          break;
        }
      }
    }
  });
  return lyric;
};
/* eslint-enable no-param-reassign */
