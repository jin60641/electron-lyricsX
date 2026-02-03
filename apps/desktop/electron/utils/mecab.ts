import { publicPath } from '../constants';
import path from 'path';

const Kuroshiro = require('kuroshiro').default;
const MecabAnalyzer = require('kuroshiro-analyzer-mecab');
const Mecab = require('mecab-async');


export const kuroshiro = new Kuroshiro();
let isInit = false;

const mecabDirPath = path.join(publicPath, 'mecab');

const mecabPath = path.join(mecabDirPath, 'bin', 'mecab');
const dictPath = path.join(mecabDirPath, 'dic', 'unidic');

export const mecab = new Mecab();
mecab.command = `${mecabPath} -d ${dictPath}`;

export const mecabAnalyzer = new MecabAnalyzer({
  command: mecab.command,
});

export const checkAnalyzer = async () => {
  if (kuroshiro.analyzer || isInit) return;
  isInit = true;
  await kuroshiro.init(mecabAnalyzer);
};

checkAnalyzer();
