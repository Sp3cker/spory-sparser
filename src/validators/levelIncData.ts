import { z } from "zod";

export const IncTrainerSchema = z.object({
  id: z.string(),
  script: z.string(),
  rematch: z.boolean().optional(),
});

export const LevelIncDataSchema = z.object({
  levelLabel: z.string(),
  baseMap: z.string(),
  thisLevelsId: z.string(),
  scriptedGives: z.array(z.any()), // Could be refined if IncScriptEvent is available
  trainerRefs: z.array(IncTrainerSchema),
});
export type IncTrainer = z.infer<typeof IncTrainerSchema>;

export type LevelIncData = z.infer<typeof LevelIncDataSchema>;
