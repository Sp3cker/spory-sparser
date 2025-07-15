import * as fs from "fs";
import * as path from "path";
import { TrainerStruct } from "../../validators/trainerRecord.ts";

function stripComments(src: string): string {
  return src.replace(/\/\*[^]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

/** Checks if trainer pic exists ELSE it returns C constant name
 * MAKE SURE YOU HAVE THE FRONT PICS!!
 */
function formatTrainerPicName(
  CVarName: string,
  frontPicDir: string
): string | null {
  if (!CVarName.startsWith("TRAINER_PIC_")) return null;
  const base = CVarName.replace("TRAINER_PIC_", "").toLowerCase();
  const fname = `${base}.webp`;
  const full = path.join(frontPicDir, fname);
  return fs.existsSync(full) ? fname : null;
}

function parseTrainerEntry(
  entry: string,
  frontPicDir: string
): { record: TrainerStruct; partySymbol?: string } | null {
  const idMatch = entry.match(/^\s*\[(\w+)\]/m);
  if (!idMatch) return null;
  const id = idMatch[1];
  const rec: TrainerStruct = { id, battlePic: "" };

  // battlePic
  const picMatch = entry.match(/\.trainerPic\s*=\s*(\w+)/);
  if (picMatch) {
    const constant = picMatch[1];
    const fname = formatTrainerPicName(constant, frontPicDir);

    rec.battlePic = fname ?? constant; // fallback to constant
  }

  // trainerName – strip _("...") -> text
  const nameMatch = entry.match(/\.trainerName\s*=\s*_\("([^"]*)"\)/);
  if (nameMatch) rec.trainerName = nameMatch[1];
  // if name is 'Grunt', append script number to name, so 'Grunt 1"
  // items array
  const itemsMatch = entry.match(/\.items\s*=\s*\{([^}]*)\}/);
  if (itemsMatch) {
    const items = itemsMatch[1]
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
    const realItems = items.filter((it) => it !== "ITEM_NONE");
    if (realItems.length) rec.items = realItems;
  }

  // boolean/dword fields we simply regex generically
  // isBossTrainer doesnt mean anything.
  const simpleFields = ["doubleBattle", "aiFlags"];
  for (const field of simpleFields) {
    const m = entry.match(new RegExp(`\\.${field}\\s*=\\s*([^,\n]+)`));
    if (!m) continue;
    const raw = m[1].trim();
    if (field === "aiFlags") {
      // Split by '|', trim, and filter empty
      rec.aiFlags = raw
        .split("|")
        .map((f) => f.trim().replace("AI_FLAG_", ""))
        .filter(Boolean);
    } else if (field === "doubleBattle") {
      rec[field] = raw === "TRUE"; // value is either 'TRUE' or 'FALSE' string, convert to js bool
    }
    // else if (field === "isBossTrainer") {
    //   rec["boss"] = raw === "TRUE"; // value is either 'TRUE' or 'FALSE' string, convert to js bool
    // }
  }

  // party symbol (used internally but not stored on record)
  const partyMatch = entry.match(
    /\.party\s*=\s*TRAINER_PARTY(?:_\w+)?\(([^)]+)\)/
  );
  const partySymbol = partyMatch ? partyMatch[1] : undefined;

  return { record: rec, partySymbol };
}

/**
 * Extract trainers from trainers.h and return a flat mapping.
 *
 * @param dataDir   Root directory of the pokeemerald decomp (contains trainers.h etc.)
 * @param parties   Mapping produced by `extractTrainerParties`. If omitted, the
 *                  function will attempt to read `generated/trainer_parties.json`
 *                  under `rootDir`.
 */
export function extractTrainers(
  dataDir: string,
  parties: Record<string, any[]>,
  battlePics: string,
  outputDir: string
): Record<string, TrainerStruct> {
  const TRAINERS_HEADER = path.join(dataDir, "trainers.h");

  const FRONT_PIC_DIR = battlePics;
  const PARTIES_JSON = path.join(outputDir, "trainer_parties.json");

  // If parties not provided, try to load it from JSON on disk.
  if (!parties) {
    if (!fs.existsSync(PARTIES_JSON)) {
      throw new Error(
        "trainer_parties.json not found; run extractTrainerParties.ts first or provide the parties map"
      );
    }
    parties = JSON.parse(fs.readFileSync(PARTIES_JSON, "utf8"));
  }

  const src = fs.readFileSync(TRAINERS_HEADER, "utf8");
  const clean = stripComments(src);

  const result: Record<string, TrainerStruct> = {};

  let i = 0;
  while (i < clean.length) {
    const startIdx = clean.indexOf("[TRAINER_", i);
    if (startIdx === -1) break;
    // find opening brace after this
    const openIdx = clean.indexOf("{", startIdx);
    if (openIdx === -1) break;
    let depth = 0;
    let j = openIdx;
    for (; j < clean.length; j++) {
      const ch = clean[j];
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          // end of struct
          // move past potential comma and newline
          j = clean.indexOf(",", j);
          if (j === -1) j = clean.length - 1;
          const entryText = clean.slice(startIdx, j);
          const { record, partySymbol } =
            parseTrainerEntry(entryText, FRONT_PIC_DIR) ?? ({} as any);
          if (!record) break;
          if (partySymbol && parties![partySymbol]) {
            record.party = parties![partySymbol];
          }
          if (partySymbol && !parties![partySymbol]) {
            // Skip trainer if no party found
            break;
          }
          result[record.id] = record;
          break;
        }
      }
    }
    i = j + 1;
  }

  // ------------------------------------------------------------
  // Mark rival variants with `rival` flag and `youPicked` starter.
  // ------------------------------------------------------------

  for (const rec of Object.values(result)) {
    const starter = getStarterFromId(rec.id);
    if (starter) {
      rec.youPicked = starter;
    }
  }

  return result;
}

const RIVAL_VARIANT_SUFFIXES = ["_TREECKO", "_TORCHIC", "_MUDKIP"] as const;

function getStarterFromId(id: string): string | undefined {
  for (const suf of RIVAL_VARIANT_SUFFIXES) {
    if (id.endsWith(suf)) {
      return suf
        .replace("_", "")
        .toLowerCase()
        .replace(/^./, (c) => c.toUpperCase());
    }
  }
  return undefined;
}
