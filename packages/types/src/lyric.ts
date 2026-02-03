export interface KrcWord {
  text: string;
  srcText: string;
  time: number;
  duration: number;
}

export interface RowBase {
  time: number,
  id: string,
  srcText: string;
  translatedText?: string;
  tlitText?: string;
}

export enum LyricFormat {
  KRC = 'krc',
  LRC = 'lrc',
}

export interface TlitItem {
  token: string;
  phoneme: string;
}

export interface KrcRow extends RowBase {
  duration: number,
  words: Array<KrcWord>,
  tlits?: Array<TlitItem>,
  tlitWords?: Array<KrcWord>,
  format: LyricFormat.KRC,
}

export interface LrcRow extends RowBase {
  timestamp: string,
  text: string,
  format: LyricFormat.LRC,
}

export type Row = KrcRow | LrcRow;

// script로부터 얻어진 정보
export interface Info {
  name: string;
  artist: string;
  album: string;
  duration: number;
  position: number;
  start: number;
  finish: number;
}

// Info 기반으로 얻은 Lyric Item

export interface MusicBase {
  id: string | number;
  name: string;
  artist: string;
  source: string;
  hasTlit: boolean;
}

export interface KrcMusic extends MusicBase {
  format: LyricFormat.KRC;
  lyric: KrcRow[],
}
export interface LrcMusic extends MusicBase {
  format: LyricFormat.LRC;
  lyric: LrcRow[],
}

export type Music = KrcMusic | LrcMusic;
