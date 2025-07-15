import { z } from "zod";

export const IncTrainerSchema = z.object({
  id: z.string(),
  script: z.string(),
  rematch: z.boolean().optional(),
});

export const IncDataSchema = z.object({
  scriptedGives: z.array(z.any()), // Could be refined if IncScriptEvent is available
  trainerRefs: z.array(IncTrainerSchema),
});

export const LevelIncDataSchema = IncDataSchema.extend({
  levelLabel: z.string(),
  baseMap: z.string(),
  thisLevelsId: z.string(),
});
export type IncTrainer = z.infer<typeof IncTrainerSchema>;
export type IncData = z.infer<typeof IncDataSchema>;
export type LevelIncData = z.infer<typeof LevelIncDataSchema>;
