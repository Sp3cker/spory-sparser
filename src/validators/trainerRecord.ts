import { z } from "zod";

export const TrainerRecordSchema = z.object({
  id: z.string(),
  battlePic: z.string(),
  party: z.array(z.any()).optional(),
  trainerName: z.string().optional(),
  items: z.array(z.string()).optional(),
  doubleBattle: z.boolean().optional(),
  aiFlags: z.array(z.string()).optional(),
  boss: z.boolean().optional(),
  youPicked: z.string().optional(),
}).catchall(z.any());

export type TrainerRecord = z.infer<typeof TrainerRecordSchema>; 