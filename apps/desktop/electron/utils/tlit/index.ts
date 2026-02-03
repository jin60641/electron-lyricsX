// index.ts
import { mecab } from '../mecab';

import { HangulHelper } from './dict';

export interface TlitItem {
  token: string;
  phoneme: string;
}

export interface TlitParameter {
  srcLang?: string;
  tlitLang: string;
  query: string;
}

export interface TlitResponse {
  message: {
    tlitResult: TlitItem[];
  };
}

const showHypen = true;
export const tlit = async (params: TlitParameter): Promise<TlitResponse> => {
  const { query } = params;

  const result = await mecab.parseSync(query);

  const tlitResult: TlitItem[] = [];

  for (let i = 0; i < result.length; i++) {
    const node = result[i];

    const [surface, reading] = node;
    if (!reading) {
      continue;
    }
    if (['ん', 'ン', 'っ', 'ッ'].includes(reading[0]) && tlitResult.length > 0) {
      const lastItem = tlitResult[tlitResult.length - 1];

      // 이전 한글 발음에 받침 추가
      const hiragana = HangulHelper.toHiragana(reading);
      const combinedPhoneme = HangulHelper.kanaToHangul(
        HangulHelper.toHiragana(lastItem.phoneme) + hiragana,
        showHypen,
      );

      // 기존 항목 업데이트 (원문 토큰 합치기 + 발음 합치기)
      lastItem.token += surface;
      lastItem.phoneme = combinedPhoneme;
    } else {
      // 3. 일반적인 경우 개별 변환 후 배열에 추가
      const hiragana = HangulHelper.toHiragana(reading);
      const phoneme = HangulHelper.kanaToHangul(hiragana, showHypen);

      tlitResult.push({
        token: surface,
        phoneme,
      });
    }
  }

  return { message: { tlitResult: tlitResult.filter((item) => !!item) } };
};
export const Translator = async (params: { text: string }) => tlit({
  query: params.text,
  tlitLang: 'ko',
});
