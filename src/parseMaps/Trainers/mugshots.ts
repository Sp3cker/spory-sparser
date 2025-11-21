import path from "path";
import { readFile } from "fs/promises";

import type { Config } from "../../config/index.ts";

type EmoteEntry = {
  gfx: string;
  pal: string;
};

type MugshotEntry = Record<string, EmoteEntry>;

type MugshotFile = {
  mugshots: Record<string, MugshotEntry>;
};

type OverworldGraphicsFile = Record<
  string,
  {
    sprites?: string[];
    palette?: string;
  }
>;

type TokenizedEntry = {
  id: string;
  spritePath: string;
  slug: string;
  tokens: string[];
};

export type MugshotDirectoryInfo = {
  constant: string;
  gfxPath: string;
  palettePath: string;
  /** Directory containing the gfx path (e.g. graphics/field_mugshots/sunrise/boy_1) */
  gfxDirectory: string;
  /** Directory relative to graphics/field_mugshots (e.g. sunrise/boy_1) */
  relativeDirectory: string;
};

export type MugshotOverworldGuess = {
  mugshotConstant: string;
  relativeDirectory: string;
  overworldId?: string | string[];
  overworldSpritePath?: string;
  confidence: number;
};

const FIELD_MUGSHOT_PREFIX = "graphics/field_mugshots/";
const OBJECT_EVENT_PREFIX = "graphics/object_events/pics/";
const STOP_WORDS = new Set([
  "graphics",
  "graphic",
  "object",
  "objects",
  "events",
  "event",
  "pics",
  "pic",
  "people",
  "pokemon",
  "misc",
  "trainers",
  "trainer",
  "front",
  "raw",
  "smol",
  "normal",
  "emote",
  "pal",
  "palette",
  "palettes",
  "gbapal",
  "bpp",
  "4bpp",
  "4",
  "animated",
  "overworld",
  "field",
  "mugshots",
]);

const TOKEN_ALIASES: Record<string, string> = {
  sis: "sister",
  bro: "brother",
  bros: "brother",
  gals: "girl",
  gal: "girl",
  guys: "guy",
  men: "man",
  ladies: "lady",
  m: "male",
  f: "female",
  mons: "mon",
  kids: "kid",
  elders: "elder",
  leaders: "leader",
};

const toPosix = (input: string) => input.replace(/\\/g, "/");

const stripExtension = (value: string) =>
  value.replace(/(\.[^/.]+)+$/, "");

const normalizeToken = (value: string): string | null => {
  if (!value) return null;
  let token = value.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!token || STOP_WORDS.has(token)) return null;
  token = TOKEN_ALIASES[token] ?? token;

  if (
    token.length > 3 &&
    token.endsWith("s") &&
    !token.endsWith("ss") &&
    !token.endsWith("us")
  ) {
    const singular = token.slice(0, -1);
    if (!STOP_WORDS.has(singular)) {
      token = TOKEN_ALIASES[singular] ?? singular;
    }
  }

  return token;
};

const tokenize = (value: string): string[] => {
  if (!value) return [];
  const normalized = stripExtension(toPosix(value));
  const rawTokens = normalized.split(/[\/_\-]/).map((token) => token.trim());
  const tokens: string[] = [];
  for (const raw of rawTokens) {
    const normalizedToken = normalizeToken(raw);
    if (normalizedToken) tokens.push(normalizedToken);
  }
  return tokens;
};

// Dice coefficient scores set overlap between two token sets (1 = identical, 0 = no shared tokens).
const diceCoefficient = (aTokens: string[], bTokens: string[]) => {
  if (!aTokens.length || !bTokens.length) return 0;

  const aSet = new Set(aTokens);
  const bSet = new Set(bTokens);
  let overlap = 0;
  for (const token of aSet) {
    if (bSet.has(token)) overlap++;
  }
  return (2 * overlap) / (aSet.size + bSet.size);
};

const deriveSlugFromSpritePath = (spritePath: string) => {
  const withoutPrefix = stripExtension(
    toPosix(spritePath).replace(OBJECT_EVENT_PREFIX, "")
  );
  const segments = withoutPrefix.split("/");
  const peopleIdx = segments.indexOf("people");
  const start = peopleIdx >= 0 ? peopleIdx + 1 : 0;
  return segments.slice(start).join("/").toLowerCase();
};

const loadOverworldSprites = async (
  config: Config
): Promise<TokenizedEntry[]> => {
  const filePath = path.resolve(config.dataDir, "object_event_graphics.json");
  const raw: OverworldGraphicsFile = JSON.parse(await readFile(filePath, "utf-8"));

  const entries: TokenizedEntry[] = [];

  for (const [id, data] of Object.entries(raw)) {
    const spritePath = data.sprites?.[0];
    if (!spritePath) continue;

    const slug = deriveSlugFromSpritePath(spritePath);
    const tokens = tokenize(slug);

    entries.push({
      id,
      spritePath: toPosix(spritePath),
      slug,
      tokens,
    });
  }

  return entries;
};

/**
 * Load mugshot metadata once so we can derive the folder that backs a mugshot constant.
 */
export const loadMugshotDirectories = async (
  config: Config
): Promise<Map<string, MugshotDirectoryInfo>> => {
  const mugsPath = path.resolve(config.dataDir, "mugshots.json");
  const raw: MugshotFile = JSON.parse(await readFile(mugsPath, "utf-8"));
  const mugshots = raw.mugshots ?? {};

  const entries = new Map<string, MugshotDirectoryInfo>();

  for (const [constant, emotes] of Object.entries(mugshots)) {
    if (!emotes) continue;

    const emoteValues = Object.values(emotes);
    if (emoteValues.length === 0) continue;

    const preferredEmote = emotes.EMOTE_NORMAL ?? emoteValues[0];
    if (!preferredEmote?.gfx) continue;

    const normalizedGfxPath = toPosix(preferredEmote.gfx);
    const gfxDirectory = path.posix.dirname(normalizedGfxPath);
    const relativeDirectory = gfxDirectory.startsWith(FIELD_MUGSHOT_PREFIX)
      ? gfxDirectory.slice(FIELD_MUGSHOT_PREFIX.length)
      : gfxDirectory;

    entries.set(constant, {
      constant,
      gfxPath: normalizedGfxPath,
      palettePath: preferredEmote.pal,
      gfxDirectory,
      relativeDirectory,
    });
  }

  return entries;
};

/**
 * Attempt to guess which overworld OBJ_EVENT graphic best matches each mugshot constant.
 */
export const matchMugshotsToOverworld = async (
  config: Config,
  mugshotDirectories?: Map<string, MugshotDirectoryInfo>
): Promise<Map<string, MugshotOverworldGuess>> => {
  const mugshots =
    mugshotDirectories ?? (await loadMugshotDirectories(config));
  const overworldEntries = await loadOverworldSprites(config);

  const overworldBySlug = new Map<string, TokenizedEntry>();
  for (const entry of overworldEntries) {
    if (!overworldBySlug.has(entry.slug)) {
      overworldBySlug.set(entry.slug, entry);
    }
  }

  const matches = new Map<string, MugshotOverworldGuess>();

  for (const [constant, info] of mugshots.entries()) {
    const normalizedSlug = info.relativeDirectory?.toLowerCase();
    const direct = normalizedSlug
      ? overworldBySlug.get(normalizedSlug)
      : undefined;

    if (direct) {
      matches.set(constant, {
        mugshotConstant: constant,
        relativeDirectory: info.relativeDirectory,
        overworldId: direct.id,
        overworldSpritePath: `overworld/animated/${direct.id}.webp`,
        confidence: 1,
      });
      continue;
    }

    const mugTokens = tokenize(info.relativeDirectory);
    let bestScore = 0;
    let bestEntry: TokenizedEntry | undefined;

    for (const entry of overworldEntries) {
      if (!entry.tokens.length) continue;
      const score = diceCoefficient(mugTokens, entry.tokens);
      if (score > bestScore) {
        bestScore = score;
        bestEntry = entry;
      }
    }

    matches.set(constant, {
      mugshotConstant: constant,
      relativeDirectory: info.relativeDirectory,
      overworldId: bestScore > 0 && bestEntry ? bestEntry.id : undefined,
      overworldSpritePath:
        bestScore > 0 && bestEntry
          ? `overworld/animated/${bestEntry.id}.webp`
          : undefined,
      confidence: Number(bestScore.toFixed(3)),
    });
  }

  return matches;
};
