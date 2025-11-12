import { z } from "zod";

export const DirectoriesSchema = z.object({
  data: z.string().min(1, "Data directory path cannot be empty"),
  sprites: z.string().min(1, "Sprites directory path cannot be empty"),
  maps: z.string().min(1, "Maps directory path cannot be empty"),
  output: z.string().min(1, "Output directory path cannot be empty"),
  miscScripts: z
    .string()
    .min(1, "Misc scripts directory path cannot be empty")
    .optional(),
});

export const ConfigSchema = z.object({
  directories: DirectoriesSchema,
});

export type ConfigType = z.infer<typeof ConfigSchema>;
