import { TlitItem } from '../../../types';

import { getConfig, request } from './auth';

export const detectLanguage = async (query: string) => {
  const url: string = 'https://papago.naver.com/apis/langs/dect'; // 요청 URL
  const resp = await request<{ langCode: string }>(
    url,
    { query },
  );
  const result: string = resp.langCode;
  return result;
};

export interface TlitParameter {
  srcLang?: string
  tlitLang: string
  query: string
}

export interface TlitResponse {
  message: {
    tlitResult: TlitItem[];
  },
}

export const tlit = async (params: TlitParameter) => {
  const srcLang = (!params.srcLang || params.srcLang === 'detect')
    ? await detectLanguage(params.query) : params.srcLang;
  if (srcLang === params.tlitLang) {
    return;
  }
  const url: string = 'https://papago.naver.com/apis/tlit/wtp'; // 요청 URL

  const resp = await request<TlitResponse>(
    url,
    { ...params, srcLang },
  );
  return resp;
};

/**
 *
 * @interface TranslateParameter
 * @property {string} source 원문 언어 코드
 * @property {string} target 목적 언어 코드
 * @property {string} text 번역할 문장
 * @property {boolean} TranslateConfig.honorific 경어(동아시아 언어에서 주로 사용)
 */
export interface TranslateParameter {
  source?: string;
  target: string;
  text: string;
  honorific: boolean;
}

export interface TranslateResult {
  srcLangType: string;
  tarLangType: string;
  translatedText: string;
  engineType: string;
  pivot: string;
  dict: string;
  tarDict: string;
  tlitSrc: TlitResponse;
  tlit: TlitResponse;
  delay: number;
  delaySmt: number;
}
export const Translator = async (params: TranslateParameter) => {
  const source = (!params.source || params.source === 'detect')
    ? await detectLanguage(params.text) : params.source;
  if (source === params.source) {
    return;
  }
  const url: string = 'https://papago.naver.com/apis/n2mt/translate'; // 요청 URL
  const { config: requestConfig, uuid } = getConfig(url);

  const resp = await request<TranslateResult>(
    url,
    {
      deviceId: uuid,
      locale: 'ko',
      dict: true,
      dictDisplay: 30,
      instant: false,
      paging: false,
      ...params,
      source,
      authroization: requestConfig.headers.Authorization,
      timestamp: requestConfig.headers.Timestamp,
    },
    requestConfig,
  );
  return resp;
};
