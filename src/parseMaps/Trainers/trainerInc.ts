import { IncBattle, IncBattleSchema } from "../../validators/levelIncData.ts";
import joinTrainerGraphics from "./joinTrainerGraphics.ts";
import { config } from "../../config/index.js";
import type { BattleType } from "../../validators/battleRecord.ts";

const trainerPics = await joinTrainerGraphics(config);

/**
 * Extract battle references from .inc script content.
 * Returns array of battles with their type and trainer IDs.
 */
export function parseTrainerBattles(incFileData: string): IncBattle[] {
  const refs: IncBattle[] = [];
  const lines = incFileData.split(/\n/);

  let currentLabel: string | null = null;
  let pendingTrainerBattle: { battleType: BattleType; isRematch: boolean } | null = null;

  for (const raw of lines) {
    const line = raw.trim();

    // detect label lines ending with '::'
    if (line.endsWith("::")) {
      currentLabel = line.slice(0, -2); // drop '::'
      continue;
    }

    if (!currentLabel) continue;

    // Check if line starts a trainerbattle command
    const battleMatch = line.match(
      /^trainerbattle_(single|no_intro|two_trainers|double|rematch|no_intro_no_whiteout)\s*\(/i
    );

    if (battleMatch) {
      const command = battleMatch[1].toLowerCase();
      const isRematch = command === "rematch";
      const battleType: BattleType = (command === "double" || command === "two_trainers") ? "double" : "single";

      // Try to get trainer ID(s) from same line
      const sameLineMatch = line.match(/\((\w+)(?:\s*,\s*(\w+))?/);

      if (sameLineMatch) {
        const trainerIds = [sameLineMatch[1]];
        if (sameLineMatch[2]) {
          trainerIds.push(sameLineMatch[2]);
        }

        const battlePicPaths = trainerIds.map(id => trainerPics.get(id) || "");

        const battleRef = IncBattleSchema.parse({
          script: currentLabel!,
          battleType,
          trainerIds,
          battlePicPaths,
          rematch: isRematch || undefined,
        });

        refs.push(battleRef);
      } else {
        // Trainer ID is on next line(s), mark pending
        pendingTrainerBattle = { battleType, isRematch };
      }
    } else if (pendingTrainerBattle) {
      // Look for trainer ID(s) on continuation line
      const trainerMatch = line.match(/^\s*(\w+)(?:\s*,\s*(\w+))?/);

      if (trainerMatch) {
        const trainerIds = [trainerMatch[1]];
        if (trainerMatch[2]) {
          trainerIds.push(trainerMatch[2]);
        }

        const battlePicPaths = trainerIds.map(id => trainerPics.get(id) || "");

        const battleRef = IncBattleSchema.parse({
          script: currentLabel!,
          battleType: pendingTrainerBattle.battleType,
          trainerIds,
          battlePicPaths,
          rematch: pendingTrainerBattle.isRematch || undefined,
        });

        refs.push(battleRef);
        pendingTrainerBattle = null;
      }
    }

    if (line === "end") {
      currentLabel = null; // block finished
      pendingTrainerBattle = null;
    }
  }

  return refs;
}

export function parseTrainerBattlesSCRIPT(
  scriptName: string,
  scriptContent: string
): IncBattle[] {
  const refs: IncBattle[] = [];
  const lines = scriptContent.split(/\n/);

  let pendingTrainerBattle: { battleType: BattleType; isRematch: boolean } | null = null;

  for (const raw of lines) {
    const line = raw.trim();

    // Check if line starts a trainerbattle command
    const battleMatch = line.match(
      /^trainerbattle_(single|no_intro|two_trainers|double|rematch|no_intro_no_whiteout)\s*\(/i
    );

    if (battleMatch) {
      const command = battleMatch[1].toLowerCase();
      const isRematch = command === "rematch";
      const battleType: BattleType = (command === "double" || command === "two_trainers") ? "double" : "single";

      // Try to get trainer ID(s) from same line
      const sameLineMatch = line.match(/\((\w+)(?:\s*,\s*(\w+))?/);

      if (sameLineMatch) {
        const trainerIds = [sameLineMatch[1]];
        if (sameLineMatch[2]) {
          trainerIds.push(sameLineMatch[2]);
        }

        const battlePicPaths = trainerIds.map(id => trainerPics.get(id) || "");

        const battleRef = IncBattleSchema.parse({
          script: scriptName!,
          battleType,
          trainerIds,
          battlePicPaths,
          rematch: isRematch || undefined,
        });

        refs.push(battleRef);
      } else {
        // Trainer ID is on next line(s), mark pending
        pendingTrainerBattle = { battleType, isRematch };
      }
    } else if (pendingTrainerBattle) {
      // Look for trainer ID(s) on continuation line
      const trainerMatch = line.match(/^\s*(\w+)(?:\s*,\s*(\w+))?/);

      if (trainerMatch) {
        const trainerIds = [trainerMatch[1]];
        if (trainerMatch[2]) {
          trainerIds.push(trainerMatch[2]);
        }

        const battlePicPaths = trainerIds.map(id => trainerPics.get(id) || "");

        const battleRef = IncBattleSchema.parse({
          script: scriptName!,
          battleType: pendingTrainerBattle.battleType,
          trainerIds,
          battlePicPaths,
          rematch: pendingTrainerBattle.isRematch || undefined,
        });

        refs.push(battleRef);
        pendingTrainerBattle = null;
      }
    }
  }

  return refs;
}
