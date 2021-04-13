import AtlassianReplacers from "./replacers/AtlassianReplacers";
import TagReplacer from "./replacers/TagReplacer";
import { IReplacer } from "./types";

const replacers: IReplacer[] = [...AtlassianReplacers, TagReplacer];

function WackyLinks(markdown: string): string {
  let newMarkdown = markdown;
  for (let replacer of replacers) {
    if (replacer.pattern.test(newMarkdown)) {
      let match = replacer.pattern.exec(newMarkdown);
      while (match) {
        newMarkdown = replacer.execute(newMarkdown, match);
        match = replacer.pattern.exec(newMarkdown);
      }
    }
  }
  return newMarkdown;
}

export default WackyLinks;
