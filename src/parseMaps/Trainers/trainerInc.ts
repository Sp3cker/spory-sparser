import { IncBattle, IncBattleSchema } from "../../validators/levelIncData.ts";
import joinTrainerGraphics from "./joinTrainerGraphics.ts";
import {
  loadMugshotDirectories,
  matchMugshotsToOverworld,
} from "./mugshots.ts";
import { config } from "../../config/index.js";
import type { BattleType } from "../../validators/battleRecord.ts";
import { getMugshotOverrideForTrainer } from "./mugshotOverrides.ts";

const trainerPics = await joinTrainerGraphics(config);
const mugshotDirectories = await loadMugshotDirectories(config);
const mugshotOverworldMatches = await matchMugshotsToOverworld(
  config,
  mugshotDirectories
);

const toArray = (value?: string | string[]) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const resolveMugshotOverworldId = (
  trainerIds: string[],
  battleType: BattleType,
  inferredValue?: string | string[]
): string | string[] | undefined => {
  const inferred = toArray(inferredValue);
  const overrides = trainerIds.map((trainerId) =>
    getMugshotOverrideForTrainer(trainerId)
  );

  if (battleType === "double") {
    const fallback = inferred[0];
    const resolved = trainerIds.map((_, index) => {
      const override = overrides[index];
      if (override) return override;
      return inferred[index] ?? fallback;
    });
    const defined = resolved.filter(Boolean) as string[];
    return defined.length ? defined : undefined;
  }

  return overrides[0] ?? inferred[0];
};

/**
 * Extract battle references from .inc script content.
 * Returns array of battles with their type and trainer IDs.
 */
// export function parseTrainerBattles(incFileData: string): IncBattle[] {
//   const refs: IncBattle[] = [];
//   const lines = incFileData.split(/\n/);

//   let currentLabel: string | null = null;
//   let pendingTrainerBattle: { battleType: BattleType; isRematch: boolean } | null = null;

//   for (const raw of lines) {
//     const line = raw.trim();

//     // detect label lines ending with '::'
//     if (line.endsWith("::")) {
//       currentLabel = line.slice(0, -2); // drop '::'
//       continue;
//     }

//     if (!currentLabel) continue;

//     // Check if line starts a trainerbattle command
//     const battleMatch = line.match(
//       /^trainerbattle_(single|no_intro|two_trainers|double|rematch|no_intro_no_whiteout)\s*\(/i
//     );

//     if (battleMatch) {
//       const command = battleMatch[1].toLowerCase();
//       const isRematch = command === "rematch";
//       const battleType: BattleType = (command === "double" || command === "two_trainers") ? "double" : "single";

//       // Try to get trainer ID(s) from same line
//       const sameLineMatch = line.match(/\((\w+)(?:\s*,\s*(\w+))?/);

//       if (sameLineMatch) {
//         const trainerIds = [sameLineMatch[1]];
//         if (sameLineMatch[2]) {
//           trainerIds.push(sameLineMatch[2]);
//         }

//         const battlePicPaths = trainerIds.map(id => trainerPics.get(id) || "");

//         const battleRef = IncBattleSchema.parse({
//           script: currentLabel!,
//           battleType,
//           trainerIds,
//           battlePicPaths,
//           rematch: isRematch || undefined,
//         });

//         refs.push(battleRef);
//       } else {
//         // Trainer ID is on next line(s), mark pending
//         pendingTrainerBattle = { battleType, isRematch };
//       }
//     } else if (pendingTrainerBattle) {
//       // Look for trainer ID(s) on continuation line
//       const trainerMatch = line.match(/^\s*(\w+)(?:\s*,\s*(\w+))?/);

//       if (trainerMatch) {
//         const trainerIds = [trainerMatch[1]];
//         if (trainerMatch[2]) {
//           trainerIds.push(trainerMatch[2]);
//         }

//         const battlePicPaths = trainerIds.map(id => trainerPics.get(id) || "");

//         const battleRef = IncBattleSchema.parse({
//           script: currentLabel!,
//           battleType: pendingTrainerBattle.battleType,
//           trainerIds,
//           battlePicPaths,
//           rematch: pendingTrainerBattle.isRematch || undefined,
//         });

//         refs.push(battleRef);
//         pendingTrainerBattle = null;
//       }
//     }

//     if (line === "end") {
//       currentLabel = null; // block finished
//       pendingTrainerBattle = null;
//     }
//   }

//   return refs;
// }

export function parseTrainerBattlesSCRIPT(
  scriptName: string,
  scriptContent: string
): IncBattle[] {
  const refs: IncBattle[] = [];
  const lines = scriptContent.split(/\n/);

  type PendingTrainerBattle = {
    battleType: BattleType;
    isRematch: boolean;
    buffer: string[];
    parenDepth: number;
  };

  const getParenDelta = (line: string) => {
    const sanitized = line.replace(/"[^"]*"/g, "");
    const openCount = (sanitized.match(/\(/g) ?? []).length;
    const closeCount = (sanitized.match(/\)/g) ?? []).length;
    return openCount - closeCount;
  };

  const extractMugshotConstant = (text: string) => {
    const match = text.match(/\{CREATE_MUGSHOT\s+(MUGSHOT_[A-Z0-9_]+)\b/i);
    return match?.[1];
  };

  let pendingTrainerBattle: PendingTrainerBattle | null = null;

  const finalizePendingBattle = () => {
    if (!pendingTrainerBattle) return;

    if (pendingTrainerBattle.parenDepth > 0) return;

    const callText = pendingTrainerBattle.buffer.join("\n");
    const trainerIds = Array.from(
      new Set(callText.match(/TRAINER_[A-Z0-9_]+/g) ?? [])
    );

    if (trainerIds.length === 0) {
      pendingTrainerBattle = null;
      return;
    }

    const battlePicPaths = trainerIds.map((id) => trainerPics.get(id) || "");
    const mugshotConstant = extractMugshotConstant(callText);
    const mugshotDirectoryInfo = mugshotConstant
      ? mugshotDirectories.get(mugshotConstant)
      : undefined;
    const mugshotOverworldInfo = mugshotConstant
      ? mugshotOverworldMatches.get(mugshotConstant)
      : undefined;

    const mugshotOverworldId = resolveMugshotOverworldId(
      trainerIds,
      pendingTrainerBattle.battleType,
      mugshotOverworldInfo?.overworldId
    );

    const battleRef = IncBattleSchema.parse({
      script: scriptName!,
      battleType: pendingTrainerBattle.battleType,
      trainerIds,
      battlePicPaths,
      rematch: pendingTrainerBattle.isRematch || undefined,
      mugshotConstant,
      mugshotRelativeDirectory: mugshotDirectoryInfo?.relativeDirectory,
      mugshotOverworldId,
      mugshotOverworldSprite: mugshotOverworldInfo?.overworldSpritePath,
      mugshotOverworldConfidence: mugshotOverworldInfo?.confidence,
    });

    refs.push(battleRef);
    pendingTrainerBattle = null;
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (pendingTrainerBattle) {
      pendingTrainerBattle.buffer.push(line);
      pendingTrainerBattle.parenDepth += getParenDelta(line);
      finalizePendingBattle();
      if (pendingTrainerBattle) {
        continue;
      }
    }

    const battleMatch = line.match(
      /^trainerbattle_(single|no_intro|two_trainers|double|rematch|no_intro_no_whiteout)\s*\(/i
    );

    if (!battleMatch) {
      continue;
    }

    const command = battleMatch[1].toLowerCase();
    const isRematch = command === "rematch";
    const battleType: BattleType =
      command === "double" || command === "two_trainers" ? "double" : "single";

    pendingTrainerBattle = {
      battleType,
      isRematch,
      buffer: [line],
      parenDepth: getParenDelta(line),
    };

    finalizePendingBattle();
  }

  return refs;
}
