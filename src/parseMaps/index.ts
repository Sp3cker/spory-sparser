import { Dirent, existsSync, readFileSync, readdirSync } from "fs";
import * as path from "path";
import { getLevelLabel, getBasemapID, getMapJsonId } from "../helpers.ts";
import { parseScriptedEvents } from "./incParser.ts";
import { parseTrainerBattles } from "./Trainers/trainerInc.ts";
import {
  LevelIncDataSchema,
  LevelIncData,
  // IncTrainerAndEventData,
  IncDataSchema,
  IncScriptEvent,
  IncTrainer,
  IncScriptedEventSchema,
  IncTrainerSchema,
} from "../validators/levelIncData.js";

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
  const incfilesInMiscDir = readdirSync(miscScriptsPath, {
    withFileTypes: true,
  })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".inc"))
    .map((entry) => path.join(miscScriptsPath, entry.name));
  const miscScriptDict = new Map<
    string,
    { scriptedGives: IncScriptEvent[]; trainerRefs: IncTrainer[] }
  >();

  for (const incFilePath of incfilesInMiscDir) {
    try {
      const content = readFileSync(incFilePath, "utf8");
      const { scriptedGives, trainerRefs } = await processIncFile(content);
      if (scriptedGives.length === 0 && trainerRefs.length === 0) {
        continue; // Skip empty scripts
      }
      // For misc scripts, we derive the level from the script, inshallah
      // So we derive a estimated base map the script happens on from the `scriptName`
      // and return it as a Record.
      const splitRegex = /^(.*?)_EventScript/; // Text before _EventScript
      ["scriptedGives", "trainerRefs"].forEach(
        (key) => {
          if (key !== "scriptedGives" && key !== "trainerRefs") {
            // gotta keep TS happy.
            return;
          }
          // 1. For this inc file, which could have many different prefixes
          // before `_EventScript`, we assign keys to `miscScriptDict`
          // based on what we can parse out of the event's script name.

          scriptedGives.map((scriptOrRef) => {
            const match = scriptOrRef.scriptName.match(splitRegex);
            let maybeBaseMap: string;
            if (match) {
              maybeBaseMap = `MAP_${match[1].toUpperCase().replace(/_/g, "_")}`;
            } else {
              maybeBaseMap = "MAP_UNKNOWN";
            }
            try {
              IncScriptedEventSchema.parse(scriptOrRef);
            } catch (e) {
              console.error(
                `Failed to parse scripted event in ${incFilePath}:`,
                e
              );
              throw e;
            }
            // If the map doesn't exist, we create it.
            if (miscScriptDict.has(maybeBaseMap)) {
              miscScriptDict
                .get(maybeBaseMap)!
                .scriptedGives.push(scriptOrRef as IncScriptEvent);
            } else {
              miscScriptDict.set(maybeBaseMap, {
                scriptedGives: [],
                trainerRefs: [],
              });
              miscScriptDict.get(maybeBaseMap)?.scriptedGives.push(
                //@ts-ignore
                scriptOrRef
              );
              // miscScriptDict.get(maybeBaseMap)![key] = [
              //   //@ts-ignore
              //   scriptOrRef as IncScriptEvent,
              // ];
            }
          });
          trainerRefs.map((scriptOrRef) => {
            const match = key.match(splitRegex);
            let maybeBaseMap: string;
            if (match) {
              maybeBaseMap = `MAP_${match[1].toUpperCase().replace(/_/g, "_")}`;
            } else {
              maybeBaseMap = "MAP_UNKNOWN";
            }
            try {
              IncTrainerSchema.parse(scriptOrRef);
            } catch (e) {
              console.error(
                `Failed to parse trainer reference in ${incFilePath}:`,
                e
              );
              throw e;
            }
            if (miscScriptDict.has(maybeBaseMap)) {
              miscScriptDict.get(maybeBaseMap)![key].push(
                //@ts-ignore
                scriptOrRef as IncTrainer
              );
            } else {
              miscScriptDict.set(maybeBaseMap, {
                scriptedGives: [],
                trainerRefs: [],
              });
              miscScriptDict.get(maybeBaseMap)?.trainerRefs.push(
                //@ts-ignore
                scriptOrRef as IncTrainer
              );
            }
          });
        }
        // return {
        //   ...script,
        //   maybeBaseMap,
        // };
      );
    } catch (e) {
      console.error(`Failed to process misc script file ${incFilePath}:`, e);
    }
  }
  console.log(miscScriptDict);
}
async function processMapsDirectory(
  mapPath: string,
  folders: Dirent[]
): Promise<LevelIncData[]> {
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
          if (giveevent.explanation) {
            continue;
          }
        }
      }
      const baseMap = await getBasemapID(parentFolderPath);
      const levelLabel = getLevelLabel(path.basename(path.dirname(fullPath)));
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
  }

  return mapLevels.map((level: LevelIncData) => {
    const obj = {
      baseMap: level.baseMap,
      levelLabel: level.levelLabel,
      thisLevelsId: level.thisLevelsId,
      scriptedGives: level.scriptedGives,
      trainerRefs: level.trainerRefs,
    };

    return obj;
  }); /** map */
}

export { LevelIncData };
