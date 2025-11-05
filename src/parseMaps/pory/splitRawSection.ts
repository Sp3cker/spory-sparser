type RawSection = string;
type PorySection = string;
type SplitPoryFile = [RawSection, PorySection];

/**
 * Splits a .pory file into sections of raw (assembly) and pory (higher-level) content
 * @param fileContents - The contents of the .pory file
 * @returns Array of tuples where each tuple is [rawContent, poryContent]
 */
export const splitRawSection = (fileContents: string): SplitPoryFile[] => {
  const rawSectionRegex = /raw\s*`([^]*?)`/g;
  const sections: SplitPoryFile[] = [];
  let lastIndex = 0;

  for (const match of fileContents.matchAll(rawSectionRegex)) {
    const rawContent = match[1];
    const matchStart = match.index!;
    const matchEnd = matchStart + match[0].length;

    // Get the pory content before this raw section
    const poryContent = fileContents.slice(lastIndex, matchStart);

    sections.push([rawContent, poryContent]);
    lastIndex = matchEnd;
  }

  // If there's content after the last raw section, add it as a section with empty raw content
  const remainingPory = fileContents.slice(lastIndex);
  if (remainingPory.trim()) {
    sections.push(["", remainingPory]);
  }

  return sections;
};
