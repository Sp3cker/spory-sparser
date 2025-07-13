import { z } from "zod";

export const LevelIncBattleSchema = z.object({
  id: z.string(),
  script: z.string(),
  rematch: z.boolean().optional(),
});

export const LevelIncDataSchema = z.object({
  levelLabel: z.string(),
  baseMap: z.string(),
  thisLevelsId: z.string(),
  scriptedGives: z.array(z.any()), // Could be refined if IncScriptEvent is available
  trainerRefs: z.array(LevelIncBattleSchema),
});

export type LevelIncData = z.infer<typeof LevelIncDataSchema>; 