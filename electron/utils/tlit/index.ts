// index.ts
import { execSync } from 'child_process';
import { HangulHelper } from './dict';
import { mecabAnalyzer, checkAnalyzer } from '../mecab';

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

export const tlit = async (params: TlitParameter): Promise<TlitResponse> => {
  const { query } = params;
  await checkAnalyzer();

  const result = await mecabAnalyzer.parse(query);

  const tlitResult: TlitItem[] = [];

  for (let i = 0; i < result.length; i++) {
    const node = result[i];
    const surface = node.surface_form || node.surface;
    const reading = node.reading || surface;

    let pron = reading;
    
    // 1. 조사 발음 보정
    if (node.pos === '助詞') {
      if (surface === 'は') pron = 'ワ';
      if (surface === 'へ') pron = 'エ';
      if (surface === '를') pron = 'オ';
    }

    // 2. 현재 형태소가 'ん'이나 'っ'인 경우, 독립된 토큰으로 만들지 않고 
    // 이전 토큰의 phoneme에 받침으로 합칩니다.
    if (['ん', 'ン', 'っ', 'ッ'].includes(pron) && tlitResult.length > 0) {
      const lastItem = tlitResult[tlitResult.length - 1];
      
      // 이전 한글 발음에 받침 추가
      const hiragana = HangulHelper.toHiragana(pron);
      const combinedPhoneme = HangulHelper.kanaToHangul(
        HangulHelper.toHiragana(lastItem.phoneme) + hiragana, 
        false
      );

      // 기존 항목 업데이트 (원문 토큰 합치기 + 발음 합치기)
      lastItem.token += surface;
      lastItem.phoneme = combinedPhoneme;
    } else {
      // 3. 일반적인 경우 개별 변환 후 배열에 추가
      const hiragana = HangulHelper.toHiragana(pron);
      const phoneme = HangulHelper.kanaToHangul(hiragana, false);

      tlitResult.push({
        token: surface,
        phoneme: phoneme,
      });
    }
  }

  console.log(tlitResult);
  return {
    message: {
      tlitResult: tlitResult.filter(item => !!item),
    },
  };
};
export const Translator = async (params: { text: string }) => {
  return await tlit({
    query: params.text,
    tlitLang: 'ko',
  });
};
