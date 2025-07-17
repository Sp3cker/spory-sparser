// import { readFile } from "fs/promises";
import { logger } from "./logger.ts";
import deepDiff from "deep-diff";

/**
 * Interface representing the structure of trainers.json
 */
interface TrainerData {
  [mapName: string]: Array<{
    id: string;
    battlePic?: string;
    trainerName?: string;
    doubleBattle?: boolean;
    aiFlags?: string[];
    party?: Array<{
      lvl: number;
      id: number;
      [key: string]: any;
    }>;
    [key: string]: any;
  }>;
}

/**
 * Interface representing the structure of levels.json
 */
interface LevelData {
  [mapName: string]: Array<{
    thisLevelsId: string;
    baseMap: string;
    levelLabel: string;
    shopItems: any[];
    pickupItems: any[];
    scriptedGives: any[];
    image: string;
    trainerRefs: any[];
    [key: string]: any;
  }>;
}

/**
 * Extracts property keys that have changed from deep-diff results
 */
function extractChangedKeys(
  differences: deepDiff.Diff<any, any>[] | undefined
): Set<string> {
  const changedKeys = new Set<string>();

  if (!differences) {
    return changedKeys;
  }

  for (const diff of differences) {
    if (diff.path) {
      // Extract the property name from the path
      for (const pathSegment of diff.path) {
        if (typeof pathSegment === "string") {
          changedKeys.add(pathSegment);
        }
      }
    }
  }

  return changedKeys;
}

/**
 * Compares existing JSON files with new data and reports changes
 */
export async function compareDataChanges({
  existingTrainers,
  newGroupedTrainers,
  existingLevels,
  newGroupedData,
}: {
  existingTrainers: TrainerData;
  existingLevels: LevelData;
  newGroupedTrainers: Record<string, any[]>;
  newGroupedData: Record<string, any[]>;
}): Promise<void> {
  const changes: string[] = [];

  try {
    // Compare trainers.json
    try {
      const trainerDifferences = deepDiff.diff(
        existingTrainers,
        newGroupedTrainers
      );
      const trainerChanges = extractChangedKeys(trainerDifferences);

      if (trainerChanges.size > 0) {
        changes.push(
          `Trainers – changed: ${Array.from(trainerChanges).join(", ")}`
        );
      }
    } catch (error) {
      throw error;
    }

    // Compare levels.json
    try {
      const levelDifferences = deepDiff.diff(existingLevels, newGroupedData);
      const levelChanges = extractChangedKeys(levelDifferences);

      if (levelChanges.size > 0) {
        changes.push(
          `Levels – changed: ${Array.from(levelChanges).join(", ")}`
        );
      }
    } catch (error) {
      throw error;
    }

    // Log results
    if (changes.length > 0) {
      logger.info("Data changes detected:");
      changes.forEach((change) => logger.info(change));
    } else {
      logger.info("No data changes detected");
    }
  } catch (error) {
    throw error;
    logger.error("Error comparing data changes:", error);
  }
}
