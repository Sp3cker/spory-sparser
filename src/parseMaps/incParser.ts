import { notneededLabels } from "../removeSimilarLocations.ts";
import {
  IncItemEntry,
  IncScriptedEventSchema,
  IncPokemonEntry,
} from "../validators/levelIncData.ts";

// export interface IncPokemonEntry {
//   species: string;
//   level: number;
//   isRandom: boolean;
// }

export class IncScriptEvent {
  public scriptName: string;
  public items: IncItemEntry[] = [];
  public pokemon: IncPokemonEntry[] = [];
  public explanation: string = "";

  constructor(name: string) {
    this.scriptName = name;
  }

  /**
   * Parse content from a script section
   */
  parseFromContent(content: string): void {
    // this.rawContent = content;
    const lines = content.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();

      // Parse @explainer comments
      this.parseExplanation(trimmed);

      // Parse giveitem commands
      this.parseGiveItemLine(trimmed);

      // Parse givemon commands
      this.parseGiveMonLine(trimmed);

      // Parse dynmultipush commands
      this.parseDynMultiPushLine(trimmed);

      // Parse giveegg commands
      this.parseGiveEggLine(trimmed);
    }

    this.filterVariables(); // Filter out VAR_ entries after parsing
  }

  private parseGiveItemLine(line: string): void {
    // Match: giveitem ITEM_NAME or giveitemfast ITEM_NAME
    // Match: giveitem ITEM_NAME, quantity or giveitemfast ITEM_NAME, quantity
    const giveItemMatch = line.match(
      /^\s*(giveitemfast|giveitem)\s+(\w+)(?:\s*,\s*(\d+))?/
    );
    if (giveItemMatch) {
      const itemName = giveItemMatch[2];
      const quantity = giveItemMatch[3] ? parseInt(giveItemMatch[3], 10) : 1;
      const existingIndex = this.items.findIndex(
        (item) => item.name === itemName
      );
      if (existingIndex !== -1) {
        this.items[existingIndex].quantity += quantity;
        return;
      }
      this.items.push({
        name: itemName,
        quantity: quantity,
      });
    }
  }

  private parseGiveMonLine(line: string): void {
    // Match: givemon SPECIES_NAME, level
    // Match: givemonrandom SPECIES_NAME, level
    const giveMonMatch = line.match(
      /^[\s]*(givemon(?:random)?)\s+(\w+)\s*,\s*(\d+)/
    );

    if (giveMonMatch) {
      const command = giveMonMatch[1];
      const species = giveMonMatch[2];
      const level = parseInt(giveMonMatch[3], 10);
      const isRandom = command === "givemonrandom";
      const alreadyExists = this.pokemon.some(
        (p) =>
          p.species === species && p.level === level && p.isRandom === isRandom
      );
      if (!alreadyExists) {
        this.pokemon.push({
          species: species,
          level: level,
          isRandom: isRandom,
        });
      }
    }
  }

  private parseDynMultiPushLine(line: string): void {
    // Match: dynmultipush text, ITEM_NAME
    // Match: dynmultipush text, SPECIES_NAME
    const dynMultiItemMatch = line.match(
      /^[\s]*dynmultipush\s+[^,]+,\s*(ITEM_\w+)/i
    );
    const dynMultiSpeciesMatch = line.match(
      /^[\s]*dynmultipush\s+[^,]+,\s*(SPECIES_\w+)/i
    );

    if (dynMultiItemMatch) {
      const itemName = dynMultiItemMatch[1];
      this.items.push({
        name: itemName,
        quantity: 1,
      });
    } else if (dynMultiSpeciesMatch) {
      const species = dynMultiSpeciesMatch[1];
      const alreadyExists = this.pokemon.some(
        (p) => p.species === species && p.level === 0 && p.isRandom === false
      );
      if (!alreadyExists) {
        this.pokemon.push({
          species: species,
          level: 0, // Level not specified in dynmultipush
          isRandom: false,
        });
      }
    }
  }

  private parseGiveEggLine(line: string): void {
    // Match: giveegg SPECIES_NAME
    const giveEggMatch = line.match(/^\s*giveegg\s+(\w+)/);
    if (giveEggMatch) {
      const species = giveEggMatch[1];
      const alreadyExists = this.pokemon.some(
        (p) => p.species === species && p.level === 0 && p.isRandom === false
      );
      if (!alreadyExists) {
        this.pokemon.push({
          species: species,
          level: 0,
          isRandom: false,
        });
      }
    }
  }

  private parseExplanation(line: string): void {
    // Match: @explainer explanation text
    const explainerMatch = line.match(/^\s*@explanation\s+(.+)$/i);

    if (explainerMatch) {
      this.explanation = explainerMatch[1].trim();
    }
  }

  /**
   * Filter out variables (VAR_*) from items and pokemon arrays
   * VAR_xxx is used to hold your selection I think...
   */
  private filterVariables(): void {
    const varPattern = /^VAR_/i;

    this.items = this.items.filter((item) => !varPattern.test(item.name));
    this.pokemon = this.pokemon.filter(
      (pokemon) => !varPattern.test(pokemon.species)
    );
  }

  hasContent(): boolean {
    return (
      this.items.length > 0 ||
      this.pokemon.length > 0 ||
      this.explanation.length > 0
    );
  }

  // getSummary(): string {
  //   const parts: string[] = [];

  //   if (this.items.length > 0) {
  //     parts.push(
  //       `${this.items.length} item${this.items.length !== 1 ? "s" : ""}`
  //     );
  //   }

  //   if (this.pokemon.length > 0) {
  //     parts.push(`${this.pokemon.length} Pokémon`);
  //   }

  //   if (this.explanation) {
  //     parts.push(`explanation: "${this.explanation}"`);
  //   }

  //   return parts.join(", ") || "no content";
  // }
}

/**
 * Extract scripts from .inc file
 */
function extractIncScriptBlocks(
  content: string
): Array<{ name: string; content: string }> {
  const lines = content.split("\n");
  const sections: Array<{ name: string; content: string }> = [];
  let currentScriptName: string | null = null;
  let currentContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if this line defines a script label (ends with ::)
    if (line.endsWith("::")) {
      // Save previous section if it exists and has content
      if (currentScriptName && currentContent.length > 0) {
        sections.push({
          name: currentScriptName,
          content: currentContent.join("\n"),
        });
      }

      // Start new section
      currentScriptName = line;
      currentContent = [];
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
    });
  }

  return sections;
}

function prettifyLabel(raw: string): string {
  const [, afterFirstUnderscore] = raw.split("_", 2);
  return (afterFirstUnderscore ?? raw)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/s\b/, "'s");
}

/**
 * Main parser function for .inc files
 * Pass a file path.
 */
export function parseScriptedEvents(content: string): IncScriptEvent[] {
  // console.log("[incParser] Starting to parse .inc content");

  const scriptBlocks = extractIncScriptBlocks(content);
  // console.log(`[incParser] Found ${sections.length} script sections`);

  const results: IncScriptEvent[] = [];

  for (const block of scriptBlocks) {
    const event = new IncScriptEvent(block.name);
    event.parseFromContent(block.content);
    IncScriptedEventSchema.parse(event); // Validate the event structure
    // Only include sections that have give events
    if (event.hasContent()) {
      results.push(event);
    }
  }
  const neededScripts = results.filter((section: IncScriptEvent) => {
    return notneededLabels.includes(section.scriptName) === false;
  });
  // Remove the first bit of scropt name before first underscore (?)
  for (const script of neededScripts) {
    try {
      const splitScriptName = script.scriptName.split("_");
      if (splitScriptName[1]) {
        script.scriptName = prettifyLabel(splitScriptName[1]);
      } else {
        script.scriptName = splitScriptName[0]
          .replace(/([A-Z])(?=[A-Z\\d])/g, " $1")
          .trim()
          .replace(/\\b\\w/g, (char: string) => char.toUpperCase()) // Added type for char
          .replace(/s\\b/, "'s");
      }
    } catch (err) {
      console.error(`Error processing script name ${script.scriptName}:`, err);
    }
  }
  const groupedByExplanation = new Map<string, IncScriptEvent>();
  const scriptsWithoutExplanation: IncScriptEvent[] = [];
  /** Group scripts by explanation to merge give events with the same explainer tag */
  for (const script of neededScripts) {
    if (script.explanation) {
      const existingScript = groupedByExplanation.get(script.explanation);
      if (existingScript) {
        // Merge items and pokemon into the first script found with this explanation
        // Merge items with quantity consolidation
        for (const newItem of script.items) {
          const existingItemIndex = existingScript.items.findIndex(
            (item) => item.name === newItem.name
          );
          if (existingItemIndex !== -1) {
            existingScript.items[existingItemIndex].quantity += newItem.quantity;
          } else {
            existingScript.items.push(newItem);
          }
        }

        // Merge pokemon (avoid duplicates)
        for (const newPokemon of script.pokemon) {
          const alreadyExists = existingScript.pokemon.some(
            (p) =>
              p.species === newPokemon.species &&
              p.level === newPokemon.level &&
              p.isRandom === newPokemon.isRandom
          );
          if (!alreadyExists) {
            existingScript.pokemon.push(newPokemon);
          }
        }
      } else {
        // First time seeing this explanation, add it to map
        groupedByExplanation.set(script.explanation, script);
      }
    } else {
      // Keep scripts without an explanation as they are
      scriptsWithoutExplanation.push(script);
    }
  }

  const finalResults = [
    ...groupedByExplanation.values(),
    ...scriptsWithoutExplanation,
  ];

  for (const script of finalResults) {
    // Consolidate items within each script (in case there are still duplicates)
    const consolidatedItems: IncItemEntry[] = [];
    for (const item of script.items) {
      const existingIndex = consolidatedItems.findIndex(
        (i) => i.name === item.name
      );
      if (existingIndex !== -1) {
        consolidatedItems[existingIndex].quantity += item.quantity;
      } else {
        consolidatedItems.push({ ...item });
      }
    }
    script.items = consolidatedItems;
  }

  return finalResults;
}
