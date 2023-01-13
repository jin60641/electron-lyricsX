import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import Crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

import axios from '../axios';

const getHash = (msg: string, key: string) => {
  const hash: Crypto.Hmac = Crypto.createHmac('md5', key)
    .update(msg);
  return hash.digest('base64');
};

const HASHING_KEY: string = 'v1.7.0_0d2601d5cf'; // Hashing 시 사용하는 Key, main.xxxxx File 내에서 authorization으로 찾을 수 있음
const C_TYPE: string = 'application/x-www-form-urlencoded; charset=UTF-8'; // Content-Type
const UA: string = 'Mozilla/5.0 (Macintosh Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36'; // User-Agent

export const getConfig = (url: string) => {
  const time: number = Date.now(); // Timestamp 생성
  const uuid: string = uuidv4(); // UUID 생성
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
  config: AxiosRequestConfig = getConfig(url).config,
): Promise<AxiosResponse<T>['data']> => {
  const body = new URLSearchParams(data);
  const resp = await axios.post(url, body.toString(), config);
  return resp.data;
};

export default request;
