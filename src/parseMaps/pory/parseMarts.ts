import * as fs from "fs";
import * as path from "path";
import { getBasemapID, getLevelLabel, getMapJsonId } from "../../helpers.ts";
// const items = JSON.parse(fs.readFileSync("./items.json").toString());

export interface Mart {
  label: string;
  mart: string;
  items: string[];
  scriptname: string;
}

export interface MartEntry {
  levelLabel: string;
  folder: string;
  baseMap: string;
  thisLevelsId: string;
  marts: Mart[];
}

function parseMapName(folderName: string): { map: string; qualifier: string } {
  // Handle the folder name parsing according to your rules
  // Example: BattleFrontier_ScottsHouse -> MAP_BATTLE_FRONTIER, qualifier: ScottsHouse

  const parts = folderName.split("_");
  const beforeUnderscore = parts[0];
  const afterUnderscore = parts
    .slice(1)
    .join("_")
    .replace(/([A-Z])(?=[A-Z\d])/g, " $1") // Add space only before uppercase not followed by number
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
  // Insert underscore before each capital letter (except the first one)
  let result;
  if (beforeUnderscore.includes("Route") === false) {
    // Dont _under_score route names
    result = beforeUnderscore.charAt(0);
    for (let i = 1; i < beforeUnderscore.length; i++) {
      if (
        beforeUnderscore.charAt(i) === beforeUnderscore.charAt(i).toUpperCase()
      ) {
        result += "_" + beforeUnderscore.charAt(i);
      } else {
        result += beforeUnderscore.charAt(i);
      }
    }
  } else {
    result = beforeUnderscore;
  }

  // Convert to uppercase and prepend MAP_
  const map = "MAP_" + result.toUpperCase();

  let qualifier = afterUnderscore || "";

  // Override qualifier for Pokemart labels
  if (
    folderName.toLowerCase().includes("pokemart") ||
    folderName.toLowerCase().includes("mart")
  ) {
    qualifier = "Mart";
  } else if (folderName.toLowerCase().includes("pokemonleague")) {
    qualifier = "Mart"; // Override for PokemonLeague
  }

  return {
    map,
    qualifier,
  };
}

// function getItemName(itemConstant: string): string {
//   // Check if we have a mapping for this item

//   const found = items.find((i: any) => i.id === itemConstant);
//   let name = "";
//   if (found) {
//     name = found.name as string;
//     if (
//       (name.includes("TM") || name.includes("HM")) &&
//       found.importance &&
//       (found.importance === "I_REUSABLE_TMS" || found.importance === 1)
//     ) {
//       const tMNameParts = found.id
//         .replace("ITEM_TM_", "")
//         .replace("ITEM_HM_", "")
//         .toLowerCase()
//         .replace(/_/g, " ")
//         .replace(/\b\w/g, (char: string) => char.toUpperCase());
//       name += ` - ${tMNameParts}`;
//     }
//   }
//   // If no mapping exists, try to create a readable name from the constant
//   // Remove ITEM_ prefix and convert to title case
//   //   name = itemConstant.replace("ITEM_", "");
//   //   name = name.toLowerCase().replace(/_/g, " ");
//   //   name = name.replace(/\b\w/g, (l) => l.toUpperCase());

//   return name;
// }

/**
 * Parse poryscript mart blocks from .pory content
 * Matches: mart MartName { ITEM_X ITEM_Y ... }
 */
export function parsePoryscriptMarts(
  poryContent: string,
  folderPath: string
): Mart[] {
  const martRegex = /mart\s+([^\s{]+)\s*\{/g;
  const marts: Mart[] = [];

  for (const match of poryContent.matchAll(martRegex)) {
    const martName = match[1];
    const martStart = match.index!;
    const braceStart = martStart + match[0].length - 1;

    let depth = 0;
    let i = braceStart;

    // Parse through the braces to find the closing brace
    for (; i < poryContent.length; i++) {
      const char = poryContent[i];

      if (char === "{") {
        depth++;
      } else if (char === "}") {
        depth--;

        if (depth === 0) {
          // Found the end of this mart block
          const body = poryContent.slice(braceStart + 1, i);

          // Parse items from the body - one item per line
          const items = body
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.startsWith("ITEM_"));

          // Get map metadata
          const { map, qualifier } = parseMapName(path.basename(folderPath));

          marts.push({
            label: map,
            mart: qualifier,
            items: items,

            scriptname: martName,
          });

          break;
        }
      }
    }

    if (depth !== 0) {
      throw new Error(`Unmatched braces in mart ${martName}`);
    }
  }

  return marts;
}

/**
 * Parse assembly-style mart sections from .inc content
 * Matches: MartName: .2byte ITEM_X .2byte ITEM_Y ... .2byte ITEM_NONE release end
 */
export function findMartSections(filePath: string): Mart[] {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const sections: Mart[] = [];

  let i = 0;
  while (i < lines.length) {
    if (
      lines[i].trim().endsWith(":") &&
      lines[i].trim().includes("Expanded") === false
    ) {
      const { map, qualifier } = parseMapName(
        path.basename(path.dirname(filePath))
      );

      // const levelLabel = getLevelLabel(path.basename(path.dirname(filePath)));

      let j = i + 1;
      const items: string[] = [];
      let scriptname = ""; // Initialize scriptname variable
      while (j < lines.length && lines[j].trim().startsWith(".2byte")) {
        items.push(lines[j].trim().split(" ")[1]);
        j++;
      }
      if (
        items.length > 0 &&
        items[items.length - 1] === "ITEM_NONE" &&
        j < lines.length &&
        lines[j].trim() === "release" &&
        j + 1 < lines.length &&
        lines[j + 1].trim() === "end"
      ) {
        scriptname = lines[i].trim(); // Store the matching line in scriptname
        if (
          map === "MAP_DEWFORD_TOWN" &&
          scriptname.toLowerCase().includes("minimart")
        ) {
          const existingSection = sections.find(
            (section) =>
              section.label === map &&
              section.scriptname.toLowerCase().includes("minimart")
          );
          if (existingSection) {
            existingSection.items.push(...items.slice(0, -1));
          } else {
            sections.push({
              label: map,
              mart: qualifier,
              items: items.slice(0, -1),

              scriptname,
            });
          }
        } else {
          sections.push({
            label: map,
            mart: qualifier,
            items: items.slice(0, -1),

            scriptname,
          });
        }
        i = j + 2;
        continue;
      }
    }
    i++;
  }
  return sections;
}

// function parseDirectory(directoryPath: string): ItemEntry[] {
//   const allItems: ItemEntry[] = [];

//   function processDirectory(dir: string) {
//     const entries = fs.readdirSync(dir, { withFileTypes: true });

//     for (const entry of entries) {
//       const fullPath = path.join(dir, entry.name);

//       if (entry.isDirectory()) {
//         processDirectory(fullPath);
//       } else if (entry.isFile() && entry.name.endsWith(".inc")) {
//         const items = findMartSections(fullPath);
//         allItems.push(...items);
//       }
//     }
//   }

//   processDirectory(directoryPath);
//   return allItems;
// }

export async function findMartSectionsByLevel(
  mapsPath: string
): Promise<MartEntry[]> {
  const folders = fs
    .readdirSync(mapsPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  const results: MartEntry[] = [];
  for (const folder of folders) {
    const fullPath = path.join(mapsPath, folder.name, "scripts.pory");
    if (!fs.existsSync(fullPath)) continue;

    const parentFolderPath = path.dirname(fullPath);
    const baseMap = await getBasemapID(parentFolderPath);
    const thisLevelsId = await getMapJsonId(
      path.join(parentFolderPath, "map.json")
    );

    const marts = findMartSections(fullPath);
    results.push({
      folder: folder.name,
      baseMap,
      levelLabel: getLevelLabel(folder.name),
      thisLevelsId,
      marts,
    });
  }

  return results;
}
