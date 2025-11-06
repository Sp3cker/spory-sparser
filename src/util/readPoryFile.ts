#!/usr/bin/env ts-node

import { readFileSync } from "fs";
// import { splitRawSection } from "../parseMaps/pory/splitRawSection.ts";
// import { extractPoryScripts } from "../parseMaps/pory/extractPoryScripts.ts";
import { parseScriptedEvents } from "../parseMaps/incParser.ts";
import { inspect } from "util";
/**
 * Reads a .pory file and splits it into raw and pory sections
 * @param filePath - Path to the .pory file to read
 * @returns Array of tuples where each tuple is [rawContent, poryContent]
 */
export function readAndSplitPoryFile(filePath: string) {
  const fileContents = readFileSync(filePath, "utf8");
  const scripts = parseScriptedEvents(fileContents);
  return scripts;
}

/**
 * Main function to demonstrate usage
 */
function main(): void {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("Usage: ts-node readPoryFile.ts <path-to-pory-file>");
    console.error(
      "Example: ts-node readPoryFile.ts maps/Route123_BerryMastersHouse/scripts.pory",
    );
    process.exit(1);
  }

  try {
    const sections = readAndSplitPoryFile(filePath);
    console.log(inspect(sections, { depth: 3, colors: true }));
    // console.log(`Found ${sections.length} section(s) in ${filePath}\n`);

    // sections.forEach(([rawContent, poryContent], index) => {
    //   console.log(`=== Section ${index + 1} ===`);

    //   if (poryContent.trim()) {
    //     console.log("--- Pory Content (before raw block) ---");
    //     console.log(poryContent);
    //     console.log();
    //   }

    //   if (rawContent.trim()) {
    //     console.log("--- Raw Content (assembly) ---");
    //     console.log(rawContent);
    //     console.log();
    //   }
    // });
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
