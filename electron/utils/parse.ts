import { v4 as uuid } from 'uuid';
import zlib from 'zlib';

import {
  KrcRow, KrcWord, LrcRow, LyricFormat, Music,
  Row,
} from '../../types';
import { LyricResponse } from '../types';

// import { tlit } from './papago';
import { kuroshiro } from './mecab';
import {
  filterRegex,
  jpRegex,
  krcLineRegex,
  krcTimeTagRegex,
  krcWordRegex,
  lrcTimeTagRegex,
  newLineRegex,
  rubyRegex,
} from './regex';
import { tlit } from './tlit';

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
    text,
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
    text,
    srcText: text,
  };
};

export const parseRowData = async (filteredLyrics: LyricResponse[]) => {
  const lyrics = await Promise.all(filteredLyrics.map(async ({ lyric, ...info }) => {
    try {
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

      const fullText = ret.map(({ srcText }) => srcText).join('\n');

      // 1. Kuroshiro를 이용해 루비(Furigana) 텍스트 생성
      const furi = await addFuriganaText(fullText);
      const furiLines = furi.split(/\r?\n|EOS/).filter((line: string) => line.trim() !== "");


      const re2 = ret.map((item, index) => {
        const furiLine = furiLines[index];
        if (!furiLine) return item;

        // 2. 루비 태그와 일반 텍스트를 토큰화 (kanji: 원문, hira: 발음)
        const tokens: { kanji: string; ruby: string; hira: string }[] = [];
        let match;

        while ((match = rubyRegex.exec(furiLine)) !== null) {
          if (match[1]) {
          // 루비 태그인 경우
            tokens.push({
              kanji: match[1],
              ruby: `<ruby>${match[1]}<rp>(</rp><rt>${match[2]}</rt><rp>)</rp></ruby>`,
              hira: match[2],
            });
          } else if (match[0].trim()) {
          // 일반 문자인 경우
            tokens.push({ kanji: match[0], ruby: match[0], hira: match[0] });
          }
        }

        let tokenIdx = 0;
        if (item.format === LyricFormat.KRC) {
          let remainLength = 0;
          const updatedWords = item.words.map((word) => {
            if (remainLength < 0) {
              remainLength++;
              return { ...word, text: '', srcText: '' };
            }
            // word.srcText가 비어있거나 공백이면 그대로 반환
            if (!word.srcText.trim()) return { ...word, text: word.srcText };

            let resultText = '';
            let resultSrcText = '';
            let remainingSrc = word.srcText;

            while (remainingSrc.length > 0 && tokenIdx < tokens.length) {
              const token = tokens[tokenIdx];
              if (token.kanji.startsWith(remainingSrc) || remainingSrc.startsWith(token.kanji)) {
                resultText += token.ruby;
                resultSrcText += token.kanji;

                if (token.kanji.length > remainingSrc.length) {
                  remainLength = remainingSrc.length - token.kanji.length;
                }
                remainingSrc = remainingSrc.substring(token.kanji.length);
                tokenIdx++;
              } else {
                resultText += remainingSrc[0];
                resultSrcText += remainingSrc[0];
                remainingSrc = remainingSrc.substring(1);
              }
            }

            return { ...word, srcText: resultSrcText || word.srcText, text: resultText || word.srcText };
          });

          return { ...item, words: updatedWords };
        }
        // LRC 처리
        if (!item.srcText.trim()) return { ...item, text: item.srcText };

        let resultText = '';
        let remainingSrc = item.srcText;

        while (remainingSrc.length > 0 && tokenIdx < tokens.length) {
          const token = tokens[tokenIdx];
          if (token.kanji.startsWith(remainingSrc) || remainingSrc.startsWith(token.kanji)) {
            resultText += token.ruby;
            remainingSrc = remainingSrc.substring(token.kanji.length);
            tokenIdx++;
          } else {
            resultText += remainingSrc[0];
            remainingSrc = remainingSrc.substring(1);
          }
        }

        return { ...item, text: resultText || item.srcText };
      });

      return {
        ...info,
        lyric: re2,
      };
    } catch (e) {
      return { lyric: '' };
    }
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
  }).join('\n');

  const tlits = await tlit({
    query: srcTexts,
    tlitLang: locale,
  }).then((item) => item?.message?.tlitResult);

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  tlits.reduce(({ texts, arr }, item) => {
    const trimed = item.token.replace('\r', '');
    const index = texts.indexOf(trimed);
    if (index === -1) {
      return { texts, arr };
    }
    let etc = texts.substr(0, index);
    texts = texts.substr(index + trimed.length);

    let target = arr.length - 1;

    const newlines = etc.match(newLineRegex);
    if (newlines) {
      for (let i = 0; i < newlines.length; i += 1) {
        const newLineIndex = etc.search(newLineRegex);
        lyric[target].tlitText = arr[target] + etc.substr(0, newLineIndex);
        etc = etc.substr(newLineIndex + newlines[i].length);
        arr.push('');
        target += 1;
      }
      arr[target] = `${item.phoneme}`;
    } else {
      arr[target] += `${etc}${item.phoneme}`;
    }

    const row = lyric[target];
    if (row.format === LyricFormat.KRC) {
      row.tlits?.push(item);
    }

    return { texts, arr };
  }, { texts: srcTexts, arr: [''] });

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
          if (tlitItemTextIndex === tlitItemText.length - 1) {
            const left = wordItem.srcText.substr(index + tlitItemText.length - tlitItemTextIndex);
            tlitItemTextIndex = 0;
            if (jpRegex.test(tlitItemText)) {
              srcText += tlitItem.phoneme;
            } else {
              srcText += tlitItem.token;
            }
            tlitArrIndex += 1;
            if (left.trim().length === 0) { // 남은 글자가 없으면?
              const { time } = row.words[startWordArrIndex];
              row.tlitWords?.push({
                time,
                duration: wordItem.duration + wordItem.time - time,
                srcText: srcText + left,
                text: srcText + left,
              });
              wordArrIndex += 1;
              startWordArrIndex = wordArrIndex;
              srcText = '';
            }
          } else {
            tlitItemTextIndex += 1;
          }
        } else {
          if (wordItem.srcText.length && !wordItem.srcText.trim().length)  { 
            row.tlitWords?.push(wordItem);
          }
          wordArrIndex += 1;
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
