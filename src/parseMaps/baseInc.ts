import { ZodSchema } from "zod";
import {
  IncTrainer,
  IncTrainerSchema,

} from "../validators/levelIncData.ts";

class BasicIncParser {
  public values: any[] = [];
  //   public matchRegex: RegExp;
  //   public validator: ZodSchema<any>;
  constructor(
    private matchRegex: RegExp,
    private onMatch: (match: string[], line: string) => any,
    private validator: ZodSchema<any>
  ) {
    this.values = [];
  }

  parse(incFileData: string) {
    const lines = incFileData.split(/\n/);
    let currentLabel: string | null = null;

    for (const raw of lines) {
      const line = raw.trim();

      // detect label lines ending with '::'
      if (line.endsWith("::")) {
        currentLabel = line.slice(0, -2); // drop '::'
        continue;
      }
      const match = line.match(this.matchRegex);
      if (match) {
        const value = this.onMatch(match, line)(currentLabel!);
        if (value) {
          try {
            this.validator.parse(value);
            this.values.push(value);
          } catch (error) {
            console.error(`Validation error for line "${line}": ${error}`);
          }
        }
        if (!currentLabel) continue;

        if (line === "end") {
          currentLabel = null; // block finished
        }
      }
    }
  }
}
/**
 * Extract trainer battle references from .inc script content.
 * Returns array of { script, trainerId }.
 */
function parseTrainerBattles(incFileData: string): IncTrainer[] {
  const parser = new BasicIncParser(
    /^trainerbattle_(?:single|no_intro|two_trainers|double|rematch)\s+(\w+)/i,
    (match: string[], line: string) => (currentLabel: string) => {
      const trainerId = match[1];
      const isRematch = line.includes("trainerbattle_rematch");

      // Validate and create the trainer reference
      const trainerRef = {
        script: currentLabel!,
        id: trainerId,
        rematch: isRematch,
      };

      return trainerRef;
    },
    IncTrainerSchema
  );
  parser.parse(incFileData);
  const refs: IncTrainer[] = parser.values;

  return refs;
}

export { parseTrainerBattles };
