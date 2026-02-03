import * as path from 'path';

import Kuroshiro from 'kuroshiro';
import MecabAnalyzer from 'kuroshiro-analyzer-mecab';
import Mecab from 'mecab-async';

import { publicPath } from '../constants';


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
