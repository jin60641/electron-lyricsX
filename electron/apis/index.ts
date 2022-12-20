import { BrowserWindow } from 'electron';

import { Info } from '../../types';
import { LyricResponse, Player } from '../types';
import { checkAnalyzer, parseRowData } from '../utils/parse';

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
  } catch (e) {
    // error logging
  }
  const lyricRes = await getLyricRes(data);

  const lyrics = await parseRowData(lyricRes);
  return lyrics;
};
export const searchMusic = async (win: BrowserWindow, data: Info) => {
  const lyrics = await getLyrics(data);
  win.webContents.send('MUSIC.SEARCH_MUSIC#SUCCESS', lyrics);
};
export const startMusic = async (win: BrowserWindow, data?: Info) => {
  if (!data) {
    win.webContents.send('MUSIC.START_MUSIC');
    return;
  }
  const { name, artist } = data;
  win.webContents.send('MUSIC.START_MUSIC', {
    name,
    artist,
  });
  const lyrics = await getLyrics(data);
  win.webContents.send('MUSIC.SEARCH_MUSIC#SUCCESS', lyrics);
};

export const seekMusic = async (win: BrowserWindow, data: Info) => {
  win.webContents.send('MUSIC.SEEK_MUSIC', data);
};

export const pauseMusic = async (win: BrowserWindow) => {
  win.webContents.send('MUSIC.PAUSE_MUSIC', '');
};

export const stopMusic = async (win: BrowserWindow) => {
  win.webContents.send('MUSIC.STOP_MUSIC', '');
};

export const setPlayer = async (win: BrowserWindow, data: Player) => {
  win.webContents.send('PREFERENCE.SET_PLAYER#SUCCESS', data);
};
