import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const file = join(dirname(fileURLToPath(import.meta.url)), "../data/abilities.h");
const src = readFileSync(file, "utf8");

// regex will grab lines like “#define ABILITY_STATIC 9”
const abilityRe = /^#define\s+(ABILITY_[A-Z0-9_]+)\s+(\d+)/gm;

const abilities: Record<string, number> = {};
let m: RegExpExecArray | null;
while ((m = abilityRe.exec(src))) {
  const [, name, val] = m;
  abilities[name] = Number(val);
}

// If you prefer a Map:
const abilityMap = new Map<string, number>(Object.entries(abilities));
writeFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../abilities.json"),
  JSON.stringify(abilities, null, 2)
);
// Example usage
// console.log(abilities);
/*
{
  ABILITY_NONE: 0,
  ABILITY_STENCH: 1,
  …,
  ABILITY_STATIC: 9,
  …
}
*/

export { abilities, abilityMap };
