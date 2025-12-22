# Audit notes for `src/parseMaps`

These notes reflect an audit of the TypeScript sources under `src/parseMaps`.

**Preference noted:** you prefer hard throws so no data is missed. Where the code currently *logs and continues*, I call that out explicitly as a potential “silent miss” and (per your preference) recommend making those cases fatal.

## A) General findings (correctness/consistency)

- `src/parseMaps/index.ts`
  - `IncScriptEvent.wildMon` is parsed in `src/parseMaps/incParser.ts` but not surfaced into the `LevelIncData` objects produced here; if `LevelIncData` is intended to include wild battle/event mons, they’re currently dropped.
  - `processMiscScriptsDirectory` creates a map value type that includes `wildMons`, but `baseMapisizeMiscScripts` does not populate it (and callers don’t merge it).

- `src/parseMaps/incParser.ts`
  - `extractIncScriptBlocks` accepts a `delimiters: [RegExp, string]` parameter but ignores the `RegExp` entirely; only the terminator string (currently `"end"`) matters. This is misleading and can cause future misuse.
  - `notneededLabels` filtering compares against raw script block names; raw “inc label” names include the trailing `:` (e.g. `"Label:"`). If `notneededLabels` is populated without colons, filtering may not work as intended.

- `src/parseMaps/baseMapisizeMiscScripts.ts`
  - Implementation is type-unsafe (`//@ts-ignore` pushing into `miscScriptDict.get(...)[key]`). It works but makes it easier to accidentally store the wrong shape without TypeScript catching it.

- `src/parseMaps/bulkExplanations.ts`
  - Appears unused/dead (not imported in the parsing flow).
  - Uses `//@ts-nocheck` and imports `IncScriptEvent` from validators rather than the class in `incParser.ts`, suggesting it was written for an older model.

- `src/parseMaps/overworld/parseMapEvents.ts`
  - Likely-buggy guard:
    - `if (typeof obj.trainer_sight_or_berry_tree_id !== 'string' && obj.trainer_sight_or_berry_tree_id !== "0") continue;`
    - For non-strings (including numeric `0`), this condition will almost always be true and will `continue`, skipping data.
  - Hidden-item collection looks inconsistent:
    - It computes `itemId = ITEMS.get(obj.trainer_sight_or_berry_tree_id)` but then pushes `item: obj.item` instead of `itemId`.
  - Error reporting wraps JSON parse errors as `new Error("huh? " + err)` without including which `map.json` failed.

- `src/parseMaps/pory/splitRawSection.ts`
  - Only splits/removes the first `raw \`...\`` block (non-global regex). If a file ever contains multiple raw blocks, extra raw content will remain in “pory content” and can lead to missed/incorrect parsing.

## B) Re-audit: where data can be missed because the code does NOT hard throw

Per your preference (hard throws so no data is missed), these are the areas that currently **log and continue** or otherwise **drop/skip** data without failing the run.

### Map/script orchestration

- `src/parseMaps/index.ts`
  - `processMiscScriptsDirectory`: wraps each `.inc` processing in `try/catch` and only `console.error(...)` on failure, then continues. A single bad misc script file can be silently omitted.
  - `processMapsDirectory`: wraps each map folder in `try/catch` and only `console.error(...)`, then continues. A single bad map folder can be silently omitted.
  - Misc merge: if a misc base map isn’t found in `mapLevels`, it fabricates a new entry with `thisLevelsId: "MAP_MISC"`. That’s fine, but if base-map derivation is wrong you can mis-attribute data rather than fail.

**Hard-throw recommendation:** remove these per-entry catches or rethrow after logging so the run fails loudly.

### Item/species mapping inside parsers

- `src/parseMaps/incParser.ts`
  - Variable species warning only: if a mon species is `VAR_*` or `VAR_RESULT`, it only `console.warn(...)`. That means a script can contain unresolved species constants and the run still succeeds.

**Hard-throw recommendation:** if unresolved `VAR_*` species are unacceptable, throw instead of warning (or make it configurable).

- `src/parseMaps/pory/parseMarts.ts`
  - Unknown item constants are only `console.warn(...)` and skipped (`itemConstantsToIds`). This causes marts to be missing items without failing the run.

**Hard-throw recommendation:** throw on unknown mart item constants.

### Trainer parsing (silent skips)

- `src/parseMaps/Trainers/extractTrainersFromHeaderFile.ts`
  - If `partySymbol && !parties[partySymbol]`, the code `break`s and effectively skips that trainer without a warning/error identifying the missing party.

**Hard-throw recommendation:** throw (or at least log-and-throw) when a trainer references a missing party.

- `src/parseMaps/Trainers/extractTrainerPartiesfromHeaderFile.ts`
  - Unknown EV constants are logged (`console.log("Unknown EV constant:", ...)`) and EVs are omitted (`undefined`).
  - Unknown move constants are silently dropped in `extractMoves` (they’re filtered out and missing mappings are ignored).

**Hard-throw recommendation:** throw on unknown EV constants and unknown move constants so trainer parties don’t lose data.

- `src/parseMaps/Trainers/joinTrainerGraphics.ts`
  - If a processed WEBP isn’t present under `config.outputDir/trainers/raw/*.webp`, the code only warns and still returns a map entry. Downstream consumers may end up with missing/inaccurate sprite paths but the run won’t fail.

**Hard-throw recommendation:** throw if the output sprite pipeline is a required invariant.

### Overworld/map event extraction

- `src/parseMaps/overworld/parseMapEvents.ts`
  - Missing overworld sprite mapping: warns and still records the trainer with `graphics_id: undefined`.
  - Missing items in object events: missing `ITEMS` mapping is silently ignored (warnings are commented out).

**Hard-throw recommendation:** throw when a trainer sprite cannot be resolved (if required) and throw when an item ball/hidden item cannot be resolved.

### Normalization / deduplication / filtering risks

These are not necessarily “errors”, but they can drop data depending on assumptions:

- `src/parseMaps/incParser.ts`
  - `notneededLabels` filtering can remove entire scripts from consideration.
  - Grouping by `@explanation` merges multiple scripts into one and dedupes items/pokemon/wildMon; if two scripts share an explanation string but represent distinct events, data can be collapsed.

**Hard-throw recommendation:** if explanation collisions are unacceptable, enforce uniqueness or include script identity in grouping.

## C) Notes on hard throws

Hard throws are a good fit for this project’s goal (“no data missed”), but they work best when error messages include:

- The source file path (e.g. which `map.json`, which `scripts.pory`).
- The script label/function name (where relevant).
- The exact constant that failed to resolve (item/species/move/ability).

