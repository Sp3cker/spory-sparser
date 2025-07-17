import * as fs from "fs";
import * as path from "path";
import { PartyMonSchema, PartyMon } from "../../validators/partyMon.ts";

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

const excludedForms = new Set([
  "mega",
  "gigantamax",
  "tera",
  "ultraburst",
  "primal",
  "eternamax",
  "totem",
]);

function stripComments(src: string): string {
  return src.replace(/\/\*[^]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

function hasIVs(raw: string): boolean {
  return /TRAINER_PARTY_IVS\s*\(/.test(raw);
}

class TrainerPartyParser {
  private speciesData: Record<string, any>;
  private abilities: Record<string, number>;
  private movesData: any[];
  private moveConstantToId: Map<string, number> = new Map();
  private speciesNameToId: Map<string, number> = new Map();

  constructor(dataDir: string) {
    try {
      const speciesDataPath = path.join(dataDir, "speciesData.json");
      this.speciesData = this.loadJsonFile(speciesDataPath);
      this.abilities = this.loadJsonFile(path.join(dataDir, "abilities.json"));
      this.movesData = this.loadJsonFile(path.join(dataDir, "moves.json"));

      // Build lookup maps after loading data
      this.buildMoveConstantMap();
      this.buildSpeciesNameMap();
    } catch (error) {
      throw new Error(`Failed to initialize TrainerPartyParser: ${error}`);
    }
  }

  private loadJsonFile<T = any>(filePath: string): T {
    if (!fs.existsSync(filePath)) {
      throw new Error(`JSON file not found: ${filePath}`);
    }
    try {
      const content = fs.readFileSync(filePath, "utf8");
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to parse JSON file ${filePath}: ${error}`);
    }
  }

  private buildMoveConstantMap(): void {
    for (const move of this.movesData) {
      if (move.constant) {
        this.moveConstantToId.set(move.constant, move.id);
      }
    }
  }

  private buildSpeciesNameMap(): void {
    // First pass: Add base forms and forms without excluded types
    for (const key of Object.keys(this.speciesData)) {
      const p = this.speciesData[key];
      if (p.forms && p.forms.some((form: string) => excludedForms.has(form))) {
        continue;
      }
      if (p?.speciesName) {
        const normalizedName = this.normalizeName(p.speciesName);
        // Only add if not already present (prioritizes base forms)
        if (!this.speciesNameToId.has(normalizedName)) {
          this.speciesNameToId.set(normalizedName, p.speciesId);
        }
      }
      if (p?.nameKey) {
        this.speciesNameToId.set(this.normalizeName(p.nameKey), p.speciesId);
      }
    }
  }

  private static normalizeName(str: string): string {
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

  private normalizeName(str: string): string {
    return TrainerPartyParser.normalizeName(str);
  }

  private constantToSpeciesId(constant: string): number {
    if (!constant.startsWith("SPECIES_")) {
      throw new Error(`Unexpected species constant format: ${constant}`);
    }
    // Strip prefix and normalise
    let candidate = this.normalizeName(constant.replace(/^SPECIES_/, ""));

    while (candidate.length) {
      const id = this.speciesNameToId.get(candidate);
      if (id !== undefined) return id;
      // drop the last segment after an underscore and retry
      const idx = candidate.lastIndexOf("_");
      if (idx === -1) break;
      candidate = candidate.slice(0, idx);
    }

    throw new Error(
      `Unable to map species constant '${constant}' to speciesId`
    );
  }

  private static parseTrainerPartyEVs(block: string) {
    // Extract the EV line from the block - improved regex to handle parentheses properly
    const evMatch = block.match(
      /\.ev\s*=\s*(TRAINER_PARTY_EVS(?:_[A-Z_]+)?(?:\([^)]*\))?)/
    );
    if (!evMatch) {
      return undefined;
    }

    const raw = evMatch[1].trim();

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
      if (
        typeof numbers === "object" &&
        numbers !== null &&
        numbers.length === 6
      ) {
        return numbers.map(Number) as number[];
      }
    }
    // fuq it
    console.log("Unknown EV constant:", constantName);
    return undefined;
  }

  private extractMoves(block: string): number[] | undefined {
    const m = block.match(/\.moves\s*=\s*\{([^}]*)\}/ms);
    if (!m) return undefined;

    const moveConstants = m[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => /^MOVE_/.test(s));

    // Map move constants to their IDs
    const moveIds: number[] = [];
    for (const constant of moveConstants) {
      const moveId = this.moveConstantToId.get(constant);
      if (moveId !== undefined) {
        moveIds.push(moveId);
      }
    }

    return moveIds.length > 0 ? moveIds : undefined;
  }
  parseMon(block: string): PartyMon {
    const mon: Partial<PartyMon> = {};
    const lineRegex = /\.(\w+)\s*=\s*([^,\n{}]+(?:\([^)]*\))?)/g;
    let lm: RegExpExecArray | null;
    while ((lm = lineRegex.exec(block)) !== null) {
      const key = lm[1];
      let raw = lm[2].trim();

      switch (key) {
        case "lvl":
          mon.lvl = parseInt(raw, 10);
          break;
        case "species":
          mon.id = this.constantToSpeciesId(raw);
          break;
        case "iv":
          if (hasIVs(raw)) {
            mon.iv = true;
          }
          break;
        case "nature":
          const n = raw.match(/NATURE_([A-Z]+)/);
          if (n) mon.nature = n[1].toLowerCase();
          break;
        case "ability":
          // ability constant like ABILITY_TECHNICIAN
          const abilityConst = raw.replace(/[,}]/g, "").trim();
          const abilityId = this.abilities[abilityConst];
          if (abilityId === undefined) {
            throw new Error(`Unknown ability constant: ${abilityConst}`);
          }
          mon.ability = [abilityId];
          break;
        case "heldItem":
          mon.item = raw.replace(/[,}]/g, "").trim();
          break;
        case "ev":
          const evs = TrainerPartyParser.parseTrainerPartyEVs(block);
          if (evs) {
            mon.ev = evs;
          }
          break;
        case "moves":
          const parsedMoves = this.extractMoves(block);
          if (parsedMoves) {
            mon.moves = parsedMoves;
          }
          break;
        default:
          (mon as any)[key] = raw;
          break;
      }
    }

    // Simple mega evolution check: only if holding a mega stone
    if (mon.item && mon.id && mon.item.slice(-5).includes("ITE")) {
      const currentSpecies = this.speciesData[mon.id.toString()];
      if (currentSpecies?.siblings) {
        for (const siblingId of currentSpecies.siblings) {
          const sibling = this.speciesData[siblingId.toString()];
          if (sibling?.forms?.includes("mega")) {
            mon.id = siblingId;
            break;
          }
        }
      }
    }

    return PartyMonSchema.parse(mon);
  }

  splitEntries(body: string): string[] {
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
  extractParties(src: string): Record<string, PartyMon[]> {
    const clean = stripComments(src);
    const regex =
      /static const struct TrainerMon\s+(sParty_\w+)\[\]\s*=\s*\{([^]*?)\};/g;
    const result: Record<string, PartyMon[]> = {};
    let m: RegExpExecArray | null;
    while ((m = regex.exec(clean)) !== null) {
      const key = m[1];
      const body = m[2];
      const mons = this.splitEntries(body).map((entry) => this.parseMon(entry));
      result[key] = mons;
    }
    return result;
  }
}

function extractTrainerParties(dataDir: string): Record<string, PartyMon[]> {
  const parser = new TrainerPartyParser(dataDir);
  const src = fs.readFileSync(path.join(dataDir, "trainer_parties.h"), "utf8");
  return parser.extractParties(src);
}

// Helper function for testing - maintains the old function interface
// Uses gameData directory by default for backward compatibility with tests
function extractPartiesTest(src: string): Record<string, PartyMon[]> {
  const dataDir = path.join(process.cwd(), "gameData");
  const parser = new TrainerPartyParser(dataDir);
  return parser.extractParties(src);
}

export {
  extractTrainerParties,
  extractPartiesTest,
  TrainerPartyParser,
  PartyMon,
};
