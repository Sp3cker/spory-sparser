type RawScripts = string;
type PorySection = string;
type SplitPoryFile = [RawScripts, PorySection];

/**
 * Splits a .pory file into raw (assembly) and pory (higher-level) content
 * Note: There is only ever 1 raw section per file
 * @param fileContents - The contents of the .pory file
 * @returns Tuple of [rawContentLength, poryContent]
 */
export const splitRawSection = (fileContents: string): SplitPoryFile => {
  const rawSectionRegex = /raw\s*`([^]*?)`/;
  const match = fileContents.match(rawSectionRegex);

  if (!match) {
    // No raw section, return all content as pory
    return ["", fileContents];
  }

  const rawContent = match[1];

  // Remove the entire raw section from the file to get pory content
  const poryContent = fileContents.replace(rawSectionRegex, "");

  return [rawContent, poryContent];
};
