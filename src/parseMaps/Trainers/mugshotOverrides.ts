/**
 * Some trainers use overworld sprites that cannot be derived automatically from
 * the mugshot metadata. List those overrides here so parser consumers receive
 * consistent data. Add entries as `"TRAINER_ID": "OBJ_EVENT_GFX_..."`.
 */
const TRAINER_MUGSHOT_OVERRIDES: Record<string, string[]> = {
  // Example:
  // "OBJ_EVENT_LASS": [TRAINER_LASS, TRAINER, JILL],
};

export const getMugshotOverrideForTrainer = (trainerId: string) =>
  TRAINER_MUGSHOT_OVERRIDES[trainerId];

