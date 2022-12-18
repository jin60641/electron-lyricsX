import zlib from 'zlib';

import { lrcTimeTagRegex } from './regex';

export const lrcTimeTagToTime = (str: string) => {
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
