import { notneededLabels } from "../removeSimilarLocations.ts";
import {
  IncItemEntry,
  IncScriptedEventSchema,
  IncPokemonEntry,
  IncWildMon,
} from "../validators/levelIncData.ts";
import { eggSpeciesMap } from "./eggMons.ts";
// export interface IncPokemonEntry {
//   species: string;
//   level: number;
//   isRandom: boolean;
// }

export class IncScriptEvent {
  public scriptName: string;
  public items: IncItemEntry[] = [];
  public pokemon: IncPokemonEntry[] = [];
  public wildMon: IncWildMon[] = [];
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
      this.parseWildMonLine(trimmed);
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
      /^\s*(givemon(?:random)?)\s+(\w+)\s*,\s*(\d+)/
    );

    if (giveMonMatch) {
      const command = giveMonMatch[1];
      const species = giveMonMatch[2];
      const level = parseInt(giveMonMatch[3], 10);
      const isRandom = command === "givemonrandom";

      // Sometimes we'll pickup redundant logic
      // where a mon *looks* like its given twice, but its because
      // of bag size logic and stuff
      const alreadyExists = this.pokemon.some(
        (p) =>
          p.species === species && p.level === level && p.isRandom === isRandom
      );
      if (!alreadyExists) {
        this.pokemon.push({
          species: species,
          level: level,
          isRandom: isRandom ? true : undefined,
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
    const eggMatch = line.match(/^\s*giveegg\s+(\w+)/);
    if (eggMatch) {
      const species = eggMatch[1];

      if (species === "SPECIES_KLAWF") {
        debugger;
      }
      // Eggs actually are random, so we need to add all the possible eggs
      if (eggSpeciesMap[species as keyof typeof eggSpeciesMap]) {
        eggSpeciesMap[species as keyof typeof eggSpeciesMap].forEach(
          (eggSpecies) => {
            this.pokemon.push({
              species: eggSpecies,
              level: 0,
            });
          }
        );
        return;
      }
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
  private parseWildMonLine(line: string) {
    // Match: setwildbattle SPECIES_NAME, LEVEL

    const match = line.match(/^setwildbattle\s+(\w+),\s*(\d+)/i);
    if (match) {
      const species = match[1];
      const level = parseInt(match[2], 10);
      if (!this.wildMon) {
        this.wildMon = [];
      }

      this.wildMon.push({
        script: this.scriptName,
        species: species,
        level: level,
      });
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
  explanationWithNoEvents(): boolean {
    const notNothing =
      this.items.length > 0 || this.pokemon.length > 0 || this.wildMon.length > 0;
    // if no items but still an explanation, fuck
    if (!notNothing && this.explanation.length > 0) {
      throw new Error("Explanation for nothing: " + this.scriptName);
    }
    return notNothing;
  }
  eventsWithNoExplanation(): void {
    if (this.explanation.length === 0 && this.hasContent()) {
      console.error("Event with no explanation: " + this.scriptName);
      throw new Error();
    }
  }
  hasContent(): boolean {
    return (
      this.items.length > 0 || this.pokemon.length > 0 || this.wildMon.length > 0
    );
  }
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
    if (line.endsWith(":")) {
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

/**
 * Main parser function for .inc files
 * Pass the parsed file.
 *
 * After parsing an inc:
 * 1. Add items/mons to scripts I know that are VAR coded
 */
export function parseScriptedEvents(content: string) {
  // console.log("[incParser] Starting to parse .inc content");

  const scriptBlocks = extractIncScriptBlocks(content);
  const filteredScripts = scriptBlocks.filter(
    (rawScriptBlock: { name: string }) => {
      if (notneededLabels.includes(rawScriptBlock.name)) {
        return false;
      }
      return true;
    }
  );
  // console.log(`[incParser] Found ${sections.length} script sections`);

  const results: IncScriptEvent[] = [];

  for (const block of filteredScripts) {
    const event = new IncScriptEvent(block.name);
    event.parseFromContent(block.content);
    IncScriptedEventSchema.parse(event); // Validate the event structure
    if (event.scriptName.includes("BerryGentleman")) {
      event.items = [{ name: "ITEM_NONE", quantity: 1 }];
    }
    // kill ourselves if we have an explanation but no events
    // Just keeps things cleaner ya know
    event.explanationWithNoEvents();
    event.eventsWithNoExplanation();
    // Only include sections that have give events
    if (event.hasContent()) {
      results.push(event);
    }
  }

  // Loop over for any `VAR` species
  for (const script of results) {
    for (const pokemon of script.pokemon) {
      if (
        pokemon.species.includes("VAR_") ||
        pokemon.species.includes("VAR_RESULT")
      ) {
        console.warn(
          `[incParser] variable species: ${pokemon.species} in script ${script.scriptName}
          Review and add to "unneededLabels" in removeSimilarLocations.ts`
        );
      }
    }
  }

  // We have to map over the ScriptedEvents
  // and assign an explanation to
  // all the scripts in Birch's Lab
  // because Birch's Lab has so many
  // dynmultipushes in DIFFERENT SCRIPTS

  for (const giveevent of results) {
    if (giveevent.scriptName.includes("NewBirchsLab_EventScript_Birch_")) {
      if (!giveevent.explanation) {
        giveevent.explanation = "Choose a starter";
      }
    }
    if (giveevent.scriptName.includes("SeashoreHouse")) {
      giveevent.explanation =
        "Defeat trainers in Seashore House (difficulty dictates species)";
    }
    if (
      giveevent.scriptName.includes("Route123_BerryMastersHouse_EventScript_")
    ) {
      giveevent.explanation = "Talk to the Berry Master";
    }
    // if (giveevent.explanation) {
    //   continue;
    // }
  }

  const groupedByExplanation = new Map<string, IncScriptEvent>();
  const scriptsWithoutExplanation: IncScriptEvent[] = [];
  /** Group scripts by explanation to merge give events with the same explainer tag */
  for (const script of results) {
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

        // Merge wildMon (avoid duplicates)
        for (const newWildMon of script.wildMon) {
          const alreadyExists = existingScript.wildMon.some(
            (w) =>
              w.species === newWildMon.species &&
              w.level === newWildMon.level &&
              w.script === newWildMon.script
          );
          if (!alreadyExists) {
            existingScript.wildMon.push(newWildMon);
          }
        }
      } else {
        // First time seeing this explanation, add it to map
        groupedByExplanation.set(script.explanation, script);
      }
    } else {
      if (script.items.length > 0) {
        // Log the line number and file path of the file containing this script
        // We'll use a workaround for file path, but line number is not directly available.
        // This will log the file path and a best-effort line number (hardcoded to this line).
        console.warn(
          `[incParser] Script "${script.scriptName}" has no explanation. It will be kept without grouping.`
        );
      }
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
