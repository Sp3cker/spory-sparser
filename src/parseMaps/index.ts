import { Dirent, existsSync, readFileSync, readdirSync } from "fs";
import * as path from "path";
import { getLevelLabel, getBasemapID, getMapJsonId } from "../helpers.ts";
import { parseScriptedEvents } from "./incParser.ts";
import {
  LevelIncDataSchema,
  LevelIncData,
  IncDataSchema,
  IncScriptEvent,
  IncTrainer,
  IncWildMon,
} from "../validators/levelIncData.js";
import { baseMapisizeMiscScripts } from "./baseMapisizeMiscScripts.ts";

/** In this file we orchestrate parsing of the configured `maps` directory
 * and the `miscScripts` directory.
 *
 * The helper function `getMapJsonId parses `levels.json` file to get the level ids.
 */
const processIncFile = async (incFileContent: string) => {
  try {
    const { scriptedGiveEvents, trainerRefs } =
      parseScriptedEvents(incFileContent);
    // Trainers should be put into `parseScriptedEvents...`
    // const trainerBattles = parseTrainerBattles(incFileContent);

    IncDataSchema.parse({
      scriptedGives: scriptedGiveEvents,
      trainerRefs: trainerRefs,
    });
    return {
      scriptedGives: scriptedGiveEvents,
      trainerRefs: trainerRefs,
    };
  } catch (error) {
    throw new Error(
      `Error processing file ${incFileContent.slice(
        incFileContent.length - 30
      )}: ${error}`
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
    const fullPath = path.join(mapPath, folder.name, "scripts.pory");
    if (!existsSync(fullPath)) continue;
    try {
      const content = readFileSync(fullPath, "utf8");
      const parentFolderPath = path.dirname(fullPath);
      const thisLevelsId = await getMapJsonId(
        path.join(parentFolderPath, "map.json")
      );
      const result = await processIncFile(content);

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

export default async function findGiveItemsByLevel(
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
