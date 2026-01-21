const Kuroshiro = require('kuroshiro').default;
const MecabAnalyzer = require('kuroshiro-analyzer-mecab');

export const kuroshiro = new Kuroshiro();
let isInit = false;
export const mecabAnalyzer = new MecabAnalyzer();

export const checkAnalyzer = async () => {
  if (kuroshiro.analyzer || isInit) return;
  isInit = true;
  await kuroshiro.init(mecabAnalyzer);
};

checkAnalyzer();
