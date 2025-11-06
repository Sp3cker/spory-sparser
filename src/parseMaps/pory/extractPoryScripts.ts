// This reads the section of a Poryscript file and creates
// objects that you can make `IncScript` objects from.
interface PoryscriptFunction {
  name: string;
  content: string;
  // fullText: string;
}

export function parsePoryscriptFunctions(
  poryContent: string,
): PoryscriptFunction[] {
  const functionRegex = /script\s+([^\s{]+)\s*\{/g;
  const functions: PoryscriptFunction[] = [];

  for (const match of poryContent.matchAll(functionRegex)) {
    const functionName = match[1];
    const functionStart = match.index!;
    const braceStart = functionStart + match[0].length - 1;

    let depth = 0;
    let i = braceStart;

    // Parse through the braces
    for (; i < poryContent.length; i++) {
      const char = poryContent[i];

      if (char === "{") {
        depth++;
      } else if (char === "}") {
        depth--;

        if (depth === 0) {
          // Found the end of this function
          // const fullText = poryContent.slice(functionStart, i + 1);
          const body = poryContent.slice(braceStart + 1, i); // Content between braces

          functions.push({
            name: functionName,
            content: body.trim(),
            // fullText,
          });

          break;
        }
      }
    }

    if (depth !== 0) {
      throw new Error(`Unmatched braces in function ${functionName}`);
    }
  }

  return functions;
}
