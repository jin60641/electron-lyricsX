export const lrcTimeTagRegex = /\[(?:(\d\d):)?(?:([0-5]\d).)?(\d\d\d?)\]/;

export const krcTimeTagRegex = /^\[(\d+),(\d+)\]$/;
export const krcLineRegex = /^((\[\d+,\d+\])+)([\s\S]+)$/;
export const krcWordRegex = /<(\d+),(\d+),(\d+)>([^<^$]+)/g;

export const filterRegex = /(language|by|title|song|album|artist|singer|lyrics|词|曲|作詞|作词|作曲|編曲|编曲|収録|收录|演唱|歌手|歌曲|制作|製作|歌词|歌詞|翻譯|翻译|插曲)\s*[:：∶]/;
