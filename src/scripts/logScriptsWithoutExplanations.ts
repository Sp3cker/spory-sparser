import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { IncScriptEvent } from "../parseMaps/incParser.ts";
import { notneededLabels } from "../removeSimilarLocations.js";

interface ScriptBlockWithLineNumber {
  name: string;
  content: string;
  startLine: number;
  endLine: number;
}

interface ScriptEventWithLocation {
  scriptName: string;
  items: { name: string; quantity: number; }[];
  pokemon: { species: string; level: number; isRandom?: boolean; }[];
  wildMon: { species: string; level: number; script: string; }[];
  explanation: string;
  filePath: string;
  startLine: number;
  endLine: number;
}

/**
 * Extract scripts from .inc file with line number tracking
 */
function extractIncScriptBlocksWithLineNumbers(
  content: string
): ScriptBlockWithLineNumber[] {
  const lines = content.split("\n");
  const sections: ScriptBlockWithLineNumber[] = [];
  let currentScriptName: string | null = null;
  let currentContent: string[] = [];
  let currentStartLine: number = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if this line defines a script label (ends with ::)
    if (line.endsWith("::")) {
      // Save previous section if it exists and has content
      if (currentScriptName && currentContent.length > 0) {
        sections.push({
          name: currentScriptName,
          content: currentContent.join("\n"),
          startLine: currentStartLine,
          endLine: i - 1,
        });
      }

      // Start new section
      currentScriptName = line;
      currentContent = [];
      currentStartLine = i + 1; // +1 because line numbers are 1-indexed
    } else if (currentScriptName) {
      // Since this line didn't end with ::
      // AND we haven't encountered another line ending with ::
      // we assume this line is the body of the previously found
      // script name.
      currentContent.push(line);

      // Stop at 'end' keyword
      if (line === "end") {
        sections.push({
          name: currentScriptName,
          content: currentContent.join("\n"),
          startLine: currentStartLine,
          endLine: i + 1, // +1 because line numbers are 1-indexed
        });
        currentScriptName = null;
        currentContent = [];
      }
    }
  }

  // Save the last section if it exists
  if (currentScriptName && currentContent.length > 0) {
    sections.push({
      name: currentScriptName,
      content: currentContent.join("\n"),
      startLine: currentStartLine,
      endLine: lines.length,
    });
  }

  return sections;
}

/**
 * Parse scripted events with location information
 */
function parseScriptedEventsWithLocation(
  content: string,
  filePath: string
): ScriptEventWithLocation[] {
  const scriptBlocks = extractIncScriptBlocksWithLineNumbers(content);
  const results: ScriptEventWithLocation[] = [];

  for (const block of scriptBlocks) {
    const event = new IncScriptEvent(block.name);
    event.parseFromContent(block.content);
    
    // Only include sections that have give events
    if (event.hasContent()) {
      const eventWithLocation: ScriptEventWithLocation = {
        scriptName: event.scriptName,
        items: event.items,
        pokemon: event.pokemon,
        wildMon: event.wildMon,
        explanation: event.explanation,
        filePath,
        startLine: block.startLine,
        endLine: block.endLine,
      };
      results.push(eventWithLocation);
    }
  }

  return results;
}

/**
 * Process a single .inc file and return scripts without explanations
 */
function processIncFileForMissingExplanations(filePath: string): ScriptEventWithLocation[] {
  try {
    const content = readFileSync(filePath, "utf8");
    const scriptedEvents = parseScriptedEventsWithLocation(content, filePath);
    
    // Filter for scripts that have items but no explanation and are not in the notneededLabels array
    return scriptedEvents.filter(event => 
      !event.explanation &&
      event.wildMon.length > 0 &&
      !notneededLabels.includes(event.scriptName)
    );
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return [];
  }
}

/**
 * Recursively find all .inc files in a directory
 */
function findIncFiles(dirPath: string): string[] {
  const incFiles: string[] = [];
  
  try {
    const entries = readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        incFiles.push(...findIncFiles(fullPath));
      } else if (entry.name.endsWith('.inc')) {
        incFiles.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }
  
  return incFiles;
}

/**
 * Main function to log all scripts without explanations
 */
async function logScriptsWithoutExplanations() {
  const mapsDir = join(process.cwd(), "maps");
  const scriptsDir = join(process.cwd(), "_scripts");
  
  const allIncFiles: string[] = [];
  
  // Add maps directory files
  if (existsSync(mapsDir)) {
    allIncFiles.push(...findIncFiles(mapsDir));
  }
  
  // Add _scripts directory files
  if (existsSync(scriptsDir)) {
    allIncFiles.push(...findIncFiles(scriptsDir));
  }
  
  console.log(`Found ${allIncFiles.length} .inc files to process\n`);
  
  const scriptsWithoutExplanations: ScriptEventWithLocation[] = [];
  
  for (const filePath of allIncFiles) {
    const missingExplanations = processIncFileForMissingExplanations(filePath);
    scriptsWithoutExplanations.push(...missingExplanations);
  }
  
  console.log(`\n=== SCRIPTS WITHOUT EXPLANATIONS ===`);
  console.log(`Total scripts found: ${scriptsWithoutExplanations.length}\n`);
  
  if (scriptsWithoutExplanations.length === 0) {
    console.log("No scripts without explanations found!");
    return;
  }
  
  // Group by file for better organization
  const groupedByFile = new Map<string, ScriptEventWithLocation[]>();
  
  for (const script of scriptsWithoutExplanations) {
    if (!groupedByFile.has(script.filePath)) {
      groupedByFile.set(script.filePath, []);
    }
    groupedByFile.get(script.filePath)!.push(script);
  }
  
  // Log results grouped by file
  for (const [filePath, scripts] of groupedByFile) {
    console.log(`\n📁 ${filePath} (${scripts.length} scripts):`);
    
    for (const script of scripts) {
      console.log(`  📄 Lines ${script.startLine}-${script.endLine}: ${script.scriptName}`);
      console.log(`      file://${filePath}:${script.startLine}`);
      
      if (script.items.length > 0) {
        const itemsList = script.items.map(item => 
          `${item.name}${item.quantity > 1 ? ` (x${item.quantity})` : ''}`
        ).join(', ');
        console.log(`    Items: ${itemsList}`);
      }
      
      if (script.pokemon.length > 0) {
        const pokemonList = script.pokemon.map(pokemon => 
          `${pokemon.species} Lv.${pokemon.level}${pokemon.isRandom ? ' (random)' : ''}`
        ).join(', ');
        console.log(`    Pokemon: ${pokemonList}`);
      }
      
      if (script.wildMon.length > 0) {
        const wildMonList = script.wildMon.map(wild => 
          `${wild.species} Lv.${wild.level}`
        ).join(', ');
        console.log(`    Wild Pokemon: ${wildMonList}`);
      }
    }
  }
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total files with missing explanations: ${groupedByFile.size}`);
  console.log(`Total scripts without explanations: ${scriptsWithoutExplanations.length}`);
}

// Run the script
logScriptsWithoutExplanations().catch(console.error);