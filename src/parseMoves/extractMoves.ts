import fs from "fs";
import path from "path";

interface MoveEntry {
  id: number;
  name: string;
  constant: string;
}

/**
 * Strip C-style block comments and line comments.
 */
function stripComments(src: string): string {
  return src.replace(/\/\*[^]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

/**
 * Extract moves from moves_info.h
 * @param rootDir Project root
 */
export function extractMoves(rootDir: string): MoveEntry[] {
  const movesHeader = path.join(rootDir, "data/moves_info.h");
  if (!fs.existsSync(movesHeader)) {
    throw new Error("moves_info.h not found in project root");
  }
  const src = fs.readFileSync(movesHeader, "utf8");
  const clean = stripComments(src);

  const regex = /\[(MOVE_[A-Z0-9_]+)]\s*=\s*\{[^}]*?\.name\s*=\s*COMPOUND_STRING\("([^"]+)"\)/gms;
  const result: MoveEntry[] = [];
  let m: RegExpExecArray | null;
  let idx = 0;
  while ((m = regex.exec(clean)) !== null) {
    const constant = m[1];
    const name = m[2].replace(/\\n/g, " ").trim();
    result.push({ id: idx, name, constant });
    idx += 1;
  }

  // Build a quick lookup table constant -> entry
  const byConstant: Record<string, MoveEntry> = {};
  for (const ent of result) byConstant[ent.constant] = ent;

  // --------------------------------------------------
  // Step 2: parse moves.h to collect alias defines
  // --------------------------------------------------
  const movesHPath = path.join(rootDir, "data/moves.h");
  if (fs.existsSync(movesHPath)) {
    const aliasSrc = stripComments(fs.readFileSync(movesHPath, "utf8"));
    const aliasRegex = /#define\s+(MOVE_[A-Z0-9_]+)\s+(MOVE_[A-Z0-9_]+)/g;
    let am: RegExpExecArray | null;
    while ((am = aliasRegex.exec(aliasSrc)) !== null) {
      const aliasConst = am[1];
      const baseConst = am[2];
      const baseEntry = byConstant[baseConst];
      if (baseEntry) {
        result.push({ id: baseEntry.id, name: baseEntry.name, constant: aliasConst });
      }
    }
  }

  return result;
}

/** CLI wrapper */
if (import.meta.url === `file://${process.argv[1]}`) {
  const rootDir = path.resolve(path.dirname(process.argv[1]), "../.." );
  const moves = extractMoves(rootDir);
  fs.mkdirSync(path.join(rootDir, "generated"), { recursive: true });
  fs.writeFileSync(
    path.join(rootDir, "generated", "moves.json"),
    JSON.stringify(moves, null, 2)
  );
  console.log("Wrote generated/moves.json (", moves.length, "moves)");
}