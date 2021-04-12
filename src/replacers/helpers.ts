export function getOuterStrings(str: string, result: RegExpExecArray) {
  const before = str.substr(0, result.index);
  const after = str.substr(result.index + result[0].length);
  return [before, after];
}
