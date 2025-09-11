declare module 'kuroshiro-analyzer-kuromoji' {
  interface KuromojiToken {
    word_id: number;
    word_type: string;
    word_position: number;
    surface_form: string;
    pos: string;
    pos_detail_1: string;
    pos_detail_2: string;
    pos_detail_3: string;
    conjugated_type: string;
    conjugated_form: string;
    basic_form: string;
    reading: string;
    pronunciation: string;
  }

  class KuromojiAnalyzer {
    init(dicPath?: string): Promise<void>;
    tokenize(text: string): Promise<KuromojiToken[]>;
  }

  export default KuromojiAnalyzer;
}

declare module 'kuroshiro' {
  interface ConvertOptions {
    mode?: 'normal' | 'spaced' | 'okurigana' | 'furigana';
    delimiter_start?: string;
    delimiter_end?: string;
  }

  class Kuroshiro {
    analyzer?: KuroshiroAnalyzer;

    init(analyzer: KuroshiroAnalyzer): Promise<void>;

    convert(
      str: string,
      options?: {
        to?: 'hiragana' | 'katakana' | 'romaji';
      } & ConvertOptions,
    ): Promise<string>;

    toHiragana(str: string, options?: ConvertOptions): Promise<string>;
    toKatakana(str: string, options?: ConvertOptions): Promise<string>;
    toRomaji(str: string, options?: ConvertOptions): Promise<string>;
    toKana(str: string, options?: ConvertOptions): Promise<string>;

    static isHiragana(str: string): boolean;
    static isKatakana(str: string): boolean;
    static isRomaji(str: string): boolean;
    static isKanji(str: string): boolean;
    static hasHiragana(str: string): boolean;
    static hasKatakana(str: string): boolean;
    static hasKanji(str: string): boolean;
  }

  export default { default: Kuroshiro };
}
