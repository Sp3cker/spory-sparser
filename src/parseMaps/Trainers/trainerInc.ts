import { IncTrainer, IncTrainerSchema } from "../../validators/levelIncData.ts";
import joinTrainerGraphics from "./joinTrainerGraphics.ts";
import { config } from "../../config/index.js";
const trainerPics = await joinTrainerGraphics(config);
/**
 * Extract trainer battle references from .inc script content.
 * Returns array of { script, trainerId }.
 */
export function parseTrainerBattles(incFileData: string): IncTrainer[] {
  const refs: IncTrainer[] = [];
  const lines = incFileData.split(/\n/);

  let currentLabel: string | null = null;
  let pendingTrainerBattle: { type: string; isRematch: boolean } | null = null;

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
      /^trainerbattle_(?:single|no_intro|two_trainers|double|rematch)\s*\(/i
    );
    
    if (battleMatch) {
      const isRematch = line.includes("trainerbattle_rematch");
      
      // Try to get trainer ID from same line: trainerbattle_single(TRAINER_ID
      const sameLineMatch = line.match(/\((\w+)/);
      
      if (sameLineMatch) {
        const trainerId = sameLineMatch[1];
        const battlePicPath = trainerPics.get(trainerId);

        const trainerRef = IncTrainerSchema.parse({
          script: currentLabel!,
          id: trainerId,
          rematch: isRematch,
          battlePicPath: battlePicPath,
        });

        refs.push(trainerRef);
      } else {
        // Trainer ID is on next line(s), mark pending
        pendingTrainerBattle = { type: battleMatch[0], isRematch };
      }
    } else if (pendingTrainerBattle) {
      // Look for trainer ID on continuation line
      const trainerMatch = line.match(/^\s*(\w+)/);
      
      if (trainerMatch) {
        const trainerId = trainerMatch[1];
        const battlePicPath = trainerPics.get(trainerId);

        const trainerRef = IncTrainerSchema.parse({
          script: currentLabel!,
          id: trainerId,
          rematch: pendingTrainerBattle.isRematch,
          battlePicPath: battlePicPath,
        });

        refs.push(trainerRef);
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
): IncTrainer[] {
  const refs: IncTrainer[] = [];
  const lines = scriptContent.split(/\n/);
  
  let pendingTrainerBattle: { type: string; isRematch: boolean } | null = null;

  for (const raw of lines) {
    const line = raw.trim();

    // Check if line starts a trainerbattle command
    const battleMatch = line.match(
      /^trainerbattle_(?:single|no_intro|two_trainers|double|rematch|no_intro_no_whiteout)\s*\(/i
    );
    
    if (battleMatch) {
      const isRematch = line.includes("trainerbattle_rematch");
      
      // Try to get trainer ID from same line: trainerbattle_single(TRAINER_ID
      const sameLineMatch = line.match(/\((\w+)/);
      
      if (sameLineMatch) {
        const trainerId = sameLineMatch[1];
        const battlePicPath = trainerPics.get(trainerId);

        const trainerRef = IncTrainerSchema.parse({
          script: scriptName!,
          id: trainerId,
          rematch: isRematch,
          battlePicPath: battlePicPath,
        });

        refs.push(trainerRef);
      } else {
        // Trainer ID is on next line(s), mark pending
        pendingTrainerBattle = { type: battleMatch[0], isRematch };
      }
    } else if (pendingTrainerBattle) {
      // Look for trainer ID on continuation line
      const trainerMatch = line.match(/^\s*(\w+)/);
      
      if (trainerMatch) {
        const trainerId = trainerMatch[1];
        const battlePicPath = trainerPics.get(trainerId);

        const trainerRef = IncTrainerSchema.parse({
          script: scriptName!,
          id: trainerId,
          rematch: pendingTrainerBattle.isRematch,
          battlePicPath: battlePicPath,
        });

        refs.push(trainerRef);
        pendingTrainerBattle = null;
      }
    }
  }

  return refs;
}
