type RawScriptSection = string;
type PoryScriptSection = string;

type SplitPoryFile = [RawScriptSection, PoryScriptSection];
const splitRawSection = (fileContents: string): SplitPoryFile[] => {
  const matches = text.matchAll(regex);
  return Array.from(matches, (match) => match[1]);
};
