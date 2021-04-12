import { IReplacer } from "../types";
import { getOuterStrings } from "./helpers";

const tagReplacer: IReplacer = {
  pattern: /\[\[(tags\.(.*))\]\]/i,
  execute: function (markdown, result) {
    const [before, after] = getOuterStrings(markdown, result);
    const link = result[1];
    const tag = result[2];
    // we can't encode the # in the title for the page, so we do this in css
    // instead we replace the title with the name of the tag
    return `${before}[[${tag}|${link}]]${after}`;
  },
};

export default tagReplacer;
