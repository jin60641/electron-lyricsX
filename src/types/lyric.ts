import { v4 as uuid } from 'uuid';

export interface KrcWord {
  text: string;
  time: number;
  duration: number;
}

export interface RowBase {
  time: number,
  id: ReturnType<typeof uuid>,
}

export interface KrcRow extends RowBase {
  duration: number,
  words: Array<KrcWord>
  format: 'krc',
}

export interface LrcRow extends RowBase {
  timestamp: string,
  text: string,
  format: 'lrc',
}

export type Row = KrcRow | LrcRow;
