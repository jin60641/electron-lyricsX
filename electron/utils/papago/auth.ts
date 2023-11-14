import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import Crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

import axios from '../axios';

const getHash = (msg: string, key: string) => {
  const hash: Crypto.Hmac = Crypto.createHmac('md5', key)
    .update(msg);
  return hash.digest('base64');
};

const C_TYPE: string = 'application/x-www-form-urlencoded; charset=UTF-8'; // Content-Type
const UA: string = 'Mozilla/5.0 (Macintosh Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36'; // User-Agent

export const getConfig = async (url: string) => {
  const time: number = Date.now(); // Timestamp 생성
  const uuid: string = uuidv4(); // UUID 생성
  const { data: naver } = await axios.get('https://papago.naver.com/');
  const $naver = cheerio.load(naver);
  const mainJsUrl = Array.from($naver('script').map((_i, script) => script.attribs.src)).find((src) => /\/main.(.*).chunk.js/.test(src));
  const { data: mainJs } = await axios.get(`https://papago.naver.com${mainJsUrl}`);
  const HASHING_KEY = mainJs.match(/"(v(\d+(?:\.\d+)+)_[^"]*)"/)[1]; // Hashing 시 사용하는 Key, main.xxxxx File 내에서 authorization으로 찾을 수 있음
  const hash: string = getHash(`${uuid}\n${url}\n${time}`, HASHING_KEY); // Authorization Header Hash 생성
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `PPG ${uuid}:${hash}`,
      'Content-Type': C_TYPE,
      'User-Agent': UA,
      Timestamp: time,
    },
  };
  return { uuid, config };
};

/**
  * @param url
  * @param data request data
  * @param config request config
  */
export const request = async <T>(
  url: string,
  data: Record<string, any>,
  configOption?: AxiosRequestConfig,
): Promise<AxiosResponse<T>['data']> => {
  const config = configOption || (await getConfig(url)).config;
  const body = new URLSearchParams(data);
  const resp = await axios.post(url, body.toString(), config);
  return resp.data;
};

export default request;
