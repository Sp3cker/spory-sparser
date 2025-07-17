import { z } from "zod";

export const PartyMonSchema = z
  .object({
    lvl: z.number(),
    id: z.number(),
    iv: z.boolean().optional(),
    nature: z.string().optional(),
    ability: z.array(z.number()).optional(),
    item: z.string().optional(),
    moves: z.array(z.number()).optional(),
    ev: z.array(z.number()).readonly().optional(),
  })
  .catchall(z.any());

export type PartyMon = z.infer<typeof PartyMonSchema>;
