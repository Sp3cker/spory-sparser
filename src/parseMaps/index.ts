import { Dirent, existsSync, readFileSync, readdirSync } from "fs";
import * as path from "path";
import { getLevelLabel, getBasemapID, getMapJsonId } from "../helpers.ts";
import { parseScriptedEvents } from "./incParser.ts";
import { parseTrainerBattles } from "./Trainers/trainerInc.ts";
import {
  LevelIncDataSchema,
  LevelIncData,
  IncDataSchema,
  IncScriptEvent,
  IncTrainer,
  IncWildMon,
} from "../validators/levelIncData.js";
import { baseMapisizeMiscScripts } from "./baseMapisizeMiscScripts.ts";
// import { parseWildMon } from "./baseInc.ts";

export const processIncFile = async (incFileContent: string) => {
  try {
    const scriptedGiveEvents = parseScriptedEvents(incFileContent);
    const trainerBattles = parseTrainerBattles(incFileContent);
    
    // Post-process the Pikachu man
    const pikachuSection = scriptedGiveEvents.find(
      (section) =>
        section.scriptName ===
        "MauvilleCity_PokemonCenter_1F_EventScript_CostumePikachuGive"
    );
    if (pikachuSection) {
      const species = [
        "SPECIES_PIKACHU_COSPLAY",
        "SPECIES_PIKACHU_ROCK_STAR",
        "SPECIES_PIKACHU_BELLE",
        "SPECIES_PIKACHU_POP_STAR",
        "SPECIES_PIKACHU_PHD",
        "SPECIES_PIKACHU_LIBRE",
        "SPECIES_PIKACHU_SURFING",
        "SPECIES_PIKACHU_FLYING",
      ];
      pikachuSection.pokemon = species.map((p) => ({
        species: p,
        level: 5,
        isRandom: true,
      }));
    }

    IncDataSchema.parse({
      scriptedGives: scriptedGiveEvents,
      trainerRefs: trainerBattles,
    });
    return {
      scriptedGives: scriptedGiveEvents,
      trainerRefs: trainerBattles,
    };
  } catch (error) {
    throw new Error(
      `Error processing file ${incFileContent.slice(30)}: ${error}`
    );
  }
};

async function processMiscScriptsDirectory(miscScriptsPath: string) {
  const miscScriptDict = new Map<
    string,
    {
      scriptedGives: IncScriptEvent[];
      trainerRefs: IncTrainer[];
      wildMons: IncWildMon[];
    }
  >();
  const incfilesInMiscDir = readdirSync(miscScriptsPath, {
    withFileTypes: true,
  })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".inc"))
    .map((entry) => path.join(miscScriptsPath, entry.name));

  for (const incFilePath of incfilesInMiscDir) {
    try {
      const content = readFileSync(incFilePath, "utf8");
      const { scriptedGives, trainerRefs } = await processIncFile(content);
      baseMapisizeMiscScripts(scriptedGives, trainerRefs, miscScriptDict);
    } catch (e) {
      console.error(`Failed to process misc script file ${incFilePath}:`, e);
    }
  }

  return miscScriptDict;
}
async function processMapsDirectory(mapPath: string, folders: Dirent[]) {
  const results: LevelIncData[] = [];
  for (const folder of folders) {
    const fullPath = path.join(mapPath, folder.name, "scripts.inc");
    if (!existsSync(fullPath)) continue;
    try {
      const content = readFileSync(fullPath, "utf8");
      const parentFolderPath = path.dirname(fullPath);
      const thisLevelsId = await getMapJsonId(
        path.join(parentFolderPath, "map.json")
      );
      const result = await processIncFile(content);
      if (result.scriptedGives.length > 0) {
        // We have to map over the ScriptedEvents
        // and assign an explanation to
        // all the scripts in Birch's Lab
        // because Birch's Lab has so many
        // dynmultipushes in DIFFERENT SCRIPTS

        for (const giveevent of result.scriptedGives) {
          if (thisLevelsId === "MAP_NEW_BIRCHS_LAB") {
            if (!giveevent.explanation) {
              giveevent.explanation = "Choose a starter";
            }
          }
          if (giveevent.scriptName.includes("SeashoreHouse")) {
            giveevent.explanation = "Defeat trainers in Seashore House";
          }
          if (giveevent.explanation) {
            continue;
          }
        }
      }
      // const wildMons = parseWildMon(content);
      const baseMap = await getBasemapID(parentFolderPath);
      const levelLabel = getLevelLabel(path.basename(path.dirname(fullPath)));
      // console.log(
      //   result.scriptedGives.map((give) => JSON.stringify(give.wildMon))
      // );
      const toPush = {
        ...result,

        baseMap,
        thisLevelsId,
        levelLabel,
      };
      LevelIncDataSchema.parse(toPush);
      results.push(toPush);
    } catch (e) {
      console.error(`Failed to process directory for ${fullPath}:`, e);
    }
  }

  return results;
}

export async function findGiveItemsByLevel(
  mapsPath: string,
  miscScriptsPath?: string
): Promise<LevelIncData[]> {
  const folders = readdirSync(mapsPath, { withFileTypes: true }).filter(
    (entry) => entry.isDirectory()
  );
  const mapLevels = await processMapsDirectory(mapsPath, folders);

  if (miscScriptsPath) {
    // If miscScriptsPath is provided, include it in the search
    //@ts-ignore
    const miscScripts = await processMiscScriptsDirectory(miscScriptsPath);
    for (const [baseMap, { scriptedGives, trainerRefs }] of miscScripts) {
      const index = mapLevels.findIndex((level) => level.baseMap === baseMap);
      if (index !== -1) {
        mapLevels[index].scriptedGives.push(...scriptedGives);
        mapLevels[index].trainerRefs.push(...trainerRefs);
      } else {
        mapLevels.push({
          baseMap,
          levelLabel: "Miscellaneous",
          thisLevelsId: "MAP_MISC",
          scriptedGives,
          trainerRefs,
        });
      }
    }
  }

  return mapLevels;
}

export { LevelIncData };
