import { BrowserWindow } from 'electron';
import * as fs from 'fs';

import { Info } from '../types';
import searchQQ from './qq';
import search163 from './163';

export const startMusic = async (win: BrowserWindow, data: Info) => {
  const lyricRes = await Promise.all([searchQQ(data), search163(data)]);
  const lyrics = lyricRes.flat();
  win.webContents.send('MUSIC.START_MUSIC', lyrics.map(lyric => ({ ...data, lyric })));
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

export const openPreference = (win: BrowserWindow) => {
  win.webContents.send('LAYOUT.SET_PREFERENCE', '');
};
