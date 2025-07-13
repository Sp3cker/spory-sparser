import * as fs from "fs";
import * as path from "path";
import { PartyMonSchema, PartyMon } from "../validators/partyMon.js";
import moveData from "../../data/moves.json" with { type: "json" }; // dont touch
import speciesData from "../../data/speciesData.json" with { type: "json" };
import abilities from "../../data/abilities.json" with { type: "json" }; // ability name to ID mapping

const Evs: Record<
  string,
  readonly [number, number, number, number, number, number]
> = {
  TRAINER_PARTY_EVS_TIMID: [6, 0, 0, 252, 0, 252],
  TRAINER_PARTY_EVS_MODEST: [6, 0, 0, 252, 0, 252],
  TRAINER_PARTY_EVS_JOLLY: [6, 252, 0, 0, 0, 252],
  TRAINER_PARTY_EVS_ADAMANT: [6, 252, 0, 0, 0, 252],
  TRAINER_PARTY_EVS_BOLD: [252, 0, 252, 6, 0, 0],
  TRAINER_PARTY_EVS_IMPISH: [252, 6, 252, 0, 0, 0],
  TRAINER_PARTY_EVS_HASTY_OR_NAIVE_ATK: [0, 252, 0, 6, 0, 252],
  TRAINER_PARTY_EVS_HASTY_OR_NAIVE_SP_ATK: [0, 6, 0, 252, 0, 252],
  TRAINER_PARTY_EVS_MILD: [0, 6, 0, 252, 0, 252],
  TRAINER_PARTY_EVS_QUIET: [252, 6, 0, 252, 0, 0],
  TRAINER_PARTY_EVS_CALM: [252, 0, 0, 6, 252, 0],
};


// Build a lookup map from normalized key => speciesId.
const SPECIES_NAME_TO_ID: Map<string, number> = new Map();

for (const key of Object.keys(speciesData)){
  const p = (speciesData as any)[key];
  if (p.forms){
    if (p.forms.includes("mega") || p.forms.includes("gigantamax") || p.forms.includes("tera") || p.forms.includes("ultraburst")) {
      continue

  } 
    //@ts-ignore
  };
  if (p?.speciesName) {
    SPECIES_NAME_TO_ID.set(normalizeName(p.speciesName), p.speciesId);
  }
  if (p?.nameKey) {
    SPECIES_NAME_TO_ID.set(normalizeName(p.nameKey), p.speciesId);
  }

}

// Utility: normalize names to a common underscore-separated lowercase form.
function normalizeName(str: string): string {
  return str
    .toLowerCase()
    .replace(/é/g, "e") // remove accent
    .replace(/[^a-z0-9♂♀ _-]/g, "") // strip exotic chars we dont care about
    .replace(/[♂]/g, "_m")
    .replace(/[♀]/g, "_f")
    .replace(/[\s-]+/g, "_") // spaces & hyphens -> underscore
    .replace(/__+/g, "_") // collapse dup underscores
    .replace(/^_+|_+$/g, ""); // trim underscores
}
/**
 * Convert a header constant (e.g. "SPECIES_DARMANITAN_GALAR_ZEN_MODE_TWO") to the corresponding numeric speciesId.
 * Throws if no mapping can be found.
 */
function constantToSpeciesId(constant: string): number {
  if (!constant.startsWith("SPECIES_")) {
    throw new Error(`Unexpected species constant format: ${constant}`);
  }
  // Strip prefix and normalise
  let candidate = normalizeName(constant.replace(/^SPECIES_/, ""));

  while (candidate.length) {
    const id = SPECIES_NAME_TO_ID.get(candidate);
    if (id !== undefined) return id;
    // drop the last segment after an underscore and retry
    const idx = candidate.lastIndexOf("_");
    if (idx === -1) break;
    candidate = candidate.slice(0, idx);
  }

  throw new Error(`Unable to map species constant '${constant}' to speciesId`);
}

/**
 * 
 * @param block the entire Pokemon block containing .ev = TRAINER_PARTY_EVS().
 * @returns [HP, ATK, DEF, SP_ATK, SP_DEF, SPD ]
 */
function parseTrainerPartyEVs(block: string) {
  // Extract the EV line from the block - improved regex to handle parentheses properly
  const evMatch = block.match(/\.ev\s*=\s*(TRAINER_PARTY_EVS(?:_[A-Z_]+)?(?:\([^)]*\))?)/);
  if (!evMatch) {
    return undefined;
  }
  
  const raw = evMatch[1].trim();
  // console.log("raw EV string:", raw);
  
  // Check if it's a predefined constant (like TRAINER_PARTY_EVS_TIMID())
  const constantName = raw.replace("()", "");
  if (Evs[constantName]) {
    return Evs[constantName];
  }
  /** If we get here
   * the evs are probly in TRAINER_PARTY_EVS(0, 0, 252, 252, 6, 0 )
   */
  if (constantName.startsWith("TRAINER_PARTY_EVS(")) {
    // Extract numbers from the constant name
    const regex = /\d+/g;
    const numbers = constantName.match(regex);
  if (typeof numbers === 'object' && numbers !== null && numbers.length === 6){
    return numbers.map(Number) as number[] // Dont touch
  } 
  }
  // If it's not a predefined constant, just return undefined
  // (instead of trying to parse custom EV values)
  console.log("Unknown EV constant:", constantName);
  return undefined;
}

function stripComments(src: string): string {
  return src.replace(/\/\*[^]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

function ivPerfect(raw: string): "perfect" | undefined {
  const m = raw.match(/TRAINER_PARTY_IVS\(([^)]*)\)/);
  if (!m) return undefined;
  const nums = m[1].split(",").map((s) => s.trim());
  return nums.length === 6 && nums.every((n) => n === "31")
    ? "perfect"
    : undefined;
}

function extractMoves(block: string): string[] | undefined {
  const m = block.match(/\.moves\s*=\s*\{([^}]*)\}/ms);
  if (!m) return undefined;
  return m[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => /^MOVE_/.test(s));
}

function parseMon(block: string): PartyMon {
  const mon: Partial<PartyMon> = {};
  const lineRegex = /\.(\w+)\s*=\s*([^,\n{}]+)/g;
  let lm: RegExpExecArray | null;
  while ((lm = lineRegex.exec(block)) !== null) {
    const key = lm[1];
    let raw = lm[2].trim();
    
    switch (key) {
      case "lvl":
        mon.lvl = parseInt(raw, 10);
        break;
      case "species":
        mon.id = constantToSpeciesId(raw);
        break;
      case "iv":
        const iv = ivPerfect(raw);
        if (iv) mon.iv = iv;
        break;
      case "nature":
        const n = raw.match(/NATURE_([A-Z]+)/);
        if (n) mon.nature = n[1].toLowerCase();
        break;
      case "ability":
        // ability constant like ABILITY_TECHNICIAN
        const abilityConst = raw.replace(/[,}]/g, "").trim();
        //@ts-ignore
        const abilityId = abilities[abilityConst];
        if (abilityId === undefined) {
          throw new Error(`Unknown ability constant: ${abilityConst}`);
        }
        mon.ability = [abilityId];
        break;
      case "heldItem":
        mon.item = raw.replace(/[,}]/g, "").trim();
        break;
      case "ev":
        mon.ev = parseTrainerPartyEVs(block);
        break;
      case "moves":
        const parsedMoves = extractMoves(block);
        if (parsedMoves) {
          mon.moves = parsedMoves.filter(m => m !== 'MOVE_NONE').map(M_Name => {
            const moveEntry = moveData.find((m: Record<string, any>) => m.constant === M_Name);
            if (moveEntry === undefined) {
              throw new Error("Cannot find move ID from MOVE_NAME: " + M_Name + "parsing" + parsedMoves)
            }
            return moveEntry.id
          });
        }
        break;
      default:
        (mon as any)[key] = raw;
        break;
    }
  }

  // Check if this mon is holding a mega stone and transform to mega form
  if (mon.item && mon.id) {
    // Get the species data for this mon
    const currentSpecies = (speciesData as any)[mon.id.toString()];
    if (currentSpecies && currentSpecies.speciesName) {
      const speciesName = currentSpecies.speciesName.toUpperCase();
      
      // Check if held item matches the pattern SPECIESNAME + (N?)ITE
      const itemName = mon.item.replace("ITEM_", "");
      const megaStonePattern = new RegExp(`^${speciesName}(N?)ITE$`);
      
      if (megaStonePattern.test(itemName)) {
        // Find the mega form through siblings
        if (currentSpecies.siblings && Array.isArray(currentSpecies.siblings)) {
          for (const siblingId of currentSpecies.siblings) {
            const sibling = (speciesData as any)[siblingId.toString()];
            if (sibling && sibling.forms && sibling.forms.includes("mega")) {
              // Found the mega form, update the mon's ID
              mon.id = siblingId;
              // Optionally remove the item since it's consumed for mega evolution
              // delete mon.item;
              break;
            }
          }
        }
      }
    }
  }

  // Simple mega evolution check: if mon has held item and has mega form, use mega ID
  if (mon.item && mon.id) {
    const currentSpecies = (speciesData as any)[mon.id.toString()];
    if (currentSpecies?.siblings) {
      for (const siblingId of currentSpecies.siblings) {
        const sibling = (speciesData as any)[siblingId.toString()];
        if (sibling?.forms?.includes("mega")) {
          mon.id = siblingId;
          break;
        }
      }
    }
  }

  return PartyMonSchema.parse(mon);
}

function splitEntries(body: string): string[] {
  const entries: string[] = [];
  let depth = 0;
  let current = "";
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === "{") {
      if (depth === 0) current = "";
      depth++;
      if (depth > 1) current += ch;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) {
        entries.push(current);
      } else current += ch;
    } else {
      if (depth > 0) current += ch;
    }
  }
  return entries;
}

function extractTrainerParties(dataDir: string): Record<string, PartyMon[]> {
  const src = fs.readFileSync(path.join(dataDir,"trainer_parties.h"), "utf8");
  const clean = stripComments(src);
  const regex =
    /static const struct TrainerMon\s+(sParty_\w+)\[\]\s*=\s*\{([^]*?)\};/g;
  const result: Record<string, PartyMon[]> = {};
  let m: RegExpExecArray | null;
  while ((m = regex.exec(clean)) !== null) {
    const key = m[1];
    const body = m[2];
    const mons = splitEntries(body).map(parseMon);
    result[key] = mons;
  }
  return result;
}

// function main() {
//   const args = process.argv.slice(2);
//   const root =
//     args[0] ??
//     path.resolve(
//       path.dirname(decodeURI(new URL(import.meta.url).pathname)),
//       "../../"
//     );
//   const result = extractTrainerParties(root);
//   fs.mkdirSync(path.join(root, "generated"), { recursive: true });
//   fs.writeFileSync(
//     path.join(root, "generated", "trainer_parties.json"),
//     JSON.stringify(result, null, 2)
//   );
//   console.log("Wrote", path.join(root, "generated", "trainer_parties.json"));
// }

// Run as CLI if executed directly
// if (import.meta.url === `file://${process.argv[1]}`) {
//   main();
// }

export { extractTrainerParties, PartyMon };
