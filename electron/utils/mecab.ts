const Kuroshiro = require('kuroshiro').default;
const MecabAnalyzer = require('kuroshiro-analyzer-mecab');
const Mecab = require('mecab-async');

export const kuroshiro = new Kuroshiro();
let isInit = false;

const dictPath = '/opt/homebrew/lib/mecab/dic/unidic';

export const mecab = new Mecab();
mecab.command = `mecab -d ${dictPath}`;
mecab._parseMeCabResult = function(result: string) {
        return result.split('\n').map(line => {
            const arr = line.split('\t');
            // EOS
            if (arr.length === 1) {
                return [line];
            }
            return arr;
        });
    };

export const mecabAnalyzer = new MecabAnalyzer();

export const checkAnalyzer = async () => {
  if (kuroshiro.analyzer || isInit) return;
  isInit = true;
  await kuroshiro.init(mecabAnalyzer);
};

checkAnalyzer();

