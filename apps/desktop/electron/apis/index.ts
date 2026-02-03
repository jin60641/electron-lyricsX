import { BrowserWindow } from 'electron';

import { Info, Music } from '@repo/types';
import { musicActions, preferenceActions } from '@repo/state';
import { LyricResponse, Player } from '../types';
import { checkAnalyzer } from '../utils/mecab';
import { parseRowData } from '../utils/parse';

import search163 from './163';
import searchKugou from './kugou';

/**
 * 검색 인자를 받아서 가사 검색 결과를 반환합니다.
 * @param {Info} data 검색 인자
 */
export const getLyricRes = async (data: Info): Promise<LyricResponse[]> => {
  const lyricRes = await Promise.all([
    searchKugou(data),
    search163(data),
    // searchLrclib(data),
  ]);
  return lyricRes.flat();
};

/**
 * 검색 인자를 받아서 변환이 완료된 가사 데이터를 반환합니다.
 * @param data 검색 인자
 */
export const getLyrics = async (data: Info) => {
  try {
    await checkAnalyzer();
  } catch {
    // noop
  }
  const lyricRes = await getLyricRes(data);
  const lyrics = await parseRowData(lyricRes);
  return lyrics;
};
export const searchMusic = async (win: BrowserWindow, data: Info) => {
  const lyrics = await getLyrics(data);
  win.webContents.send(musicActions.searchMusic.success.type, lyrics);
};
export const startMusic = async (win: BrowserWindow, data?: Info) => {
  if (!data) {
    win.webContents.send(musicActions.startMusic.type);
    return;
  }
  const { name, artist } = data;
  win.webContents.send(musicActions.startMusic.type, {
    name,
    artist,
  });
  const lyrics = await getLyrics(data);
  win.webContents.send(musicActions.searchMusic.success.type, lyrics);
};

export const seekMusic = async (win: BrowserWindow, data: Info) => {
  win.webContents.send(musicActions.seekMusic.type, data);
};

export const pauseMusic = async (win: BrowserWindow) => {
  win.webContents.send(musicActions.pauseMusic.type, '');
};

export const stopMusic = async (win: BrowserWindow) => {
  win.webContents.send(musicActions.stopMusic.type, '');
};

export const setPlayer = async (win: BrowserWindow, data: Player) => {
  win.webContents.send(preferenceActions.setPlayer.success.type, data);
};

export const sendTranslatedLyric = async (win: BrowserWindow, data: Music['lyric']) => {
  win.webContents.send(musicActions.translateLyric.success.type, data);
};
