declare module 'kuroshiro' {
  type ConvertOptions = { mode: string; to: string };
  export default class Kuroshiro {
    analyzer?: unknown;
    init(analyzer: unknown): Promise<void>;
    convert(text: string, options: ConvertOptions): Promise<string>;
  }
}

declare module 'kuroshiro-analyzer-mecab' {
  export default class MecabAnalyzer {
    constructor(options: { command: string });
  }
}

declare module 'mecab-async' {
  export default class Mecab {
    command: string;
    parseSync(input: string): Array<[string, string?]>;
  }
}
