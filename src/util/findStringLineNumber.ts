// used to line number of unexplained event for logging in console
// so u can click it and go to the file.
export function findStringLineNumber(
  fileContents: string,
  searchString: string,
): { lineNumber: number; lineContent: string } | null {
  const lines = fileContents.split("\n");
debugger
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().includes(searchString)) {
      return {
        lineNumber: i + 1,
        lineContent: lines[i],
      };
    }
  }

  return null;
}
