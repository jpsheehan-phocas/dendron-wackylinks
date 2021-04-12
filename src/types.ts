export interface IReplacer {
  pattern: RegExp;
  execute: (markdown: string, result: RegExpExecArray) => string;
}

export type Global = typeof global & { wackyCache: any };
