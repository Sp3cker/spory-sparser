import { IncTrainer, IncTrainerSchema } from "../../validators/levelIncData.ts";

/**
 * Extract trainer battle references from .inc script content.
 * Returns array of { script, trainerId }.
 */
export function parseTrainerBattles(incFileData: string): IncTrainer[] {
  const refs: IncTrainer[] = [];
  const lines = incFileData.split(/\n/);

  let currentLabel: string | null = null;

  for (const raw of lines) {
    const line = raw.trim();

    // detect label lines ending with '::'
    if (line.endsWith("::")) {
      currentLabel = line.slice(0, -2); // drop '::'
      continue;
    }

    if (!currentLabel) continue;

    const m = line.match(
      /^trainerbattle_(?:single|no_intro|two_trainers|double|rematch)\s+(\w+)/i
    );
    if (m) {
      const trainerId = m[1];
      const isRematch = line.includes("trainerbattle_rematch");

      // Validate and create the trainer reference
      const trainerRef = IncTrainerSchema.parse({
        script: currentLabel!,
        id: trainerId,
        rematch: isRematch,
      });

      refs.push(trainerRef);
    }

    if (line === "end") {
      currentLabel = null; // block finished
    }
  }

  return refs;
}
