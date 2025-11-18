import { readFile, writeFile } from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(
  __dirname,
  "..",
  "..",
  "gameData",
  "items.json"
);
type ItemRecord = {
  id: number;
  [key: string]: unknown;
};

type TeachableRecord = {
  itemId: number;
  [key: string]: unknown;
};

function getJsonPath(relativeSegments: string[]) {
  return path.resolve(__dirname, "..", "..", ...relativeSegments);
}

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function main() {
  const itemsPath = getJsonPath(["gameData", "items.json"]);
  const teachablesPath = getJsonPath(["gameData", "teachables.json"]);

  const [items, teachables] = await Promise.all([
    readJson<ItemRecord[]>(itemsPath),
    readJson<TeachableRecord[]>(teachablesPath),
  ]);

  const allowedKeys = new Set<string>();
  const itemsById = new Map<number, ItemRecord>();

  for (const item of items) {
    if (typeof item.id !== "number") {
      throw new Error(
        `Encountered item without numeric id: ${JSON.stringify(item)}`
      );
    }
    itemsById.set(item.id, item);
    for (const key of Object.keys(item)) {
      allowedKeys.add(key);
    }
  }

  const droppedProps = new Set<string>();
  let mergedCount = 0;
  let createdCount = 0;

  for (const teachable of teachables) {
    if (typeof teachable.itemId !== "number") {
      throw new Error(
        `Teachable is missing a numeric itemId: ${JSON.stringify(teachable)}`
      );
    }

    let item = itemsById.get(teachable.itemId);

    if (!item) {
      item = { id: teachable.itemId };
      items.push(item);
      itemsById.set(teachable.itemId, item);
      createdCount += 1;
    }

    for (const [key, value] of Object.entries(teachable)) {
      if (key === "itemId") {
        continue;
      }

      if (!allowedKeys.has(key)) {
        droppedProps.add(key);
        continue;
      }

      item[key] = value;
    }

    mergedCount += 1;
  }

  items.sort((a, b) => {
    if (typeof a.id !== "number" || typeof b.id !== "number") {
      return 0;
    }
    return a.id - b.id;
  });

  let iconPicRemoved = 0;
  let iconPaletteRemoved = 0;
  let iconPalleteRemoved = 0;

  const sanitizedItems = items.map((item) => {
    if (typeof item !== "object" || item === null) {
      return item;
    }
    const clone: ItemRecord = { ...item };
    const target = clone as Record<string, unknown>;
    if ("iconPic" in target) {
      delete target["iconPic"];
      iconPicRemoved += 1;
    }
    if ("iconPalette" in target) {
      delete target["iconPalette"];
      iconPaletteRemoved += 1;
    }
    if ("iconPallete" in target) {
      delete target["iconPallete"];
      iconPalleteRemoved += 1;
    }
    return clone;
  });

  await writeFile(
    outputPath,
    `${JSON.stringify(sanitizedItems, null, 4)}\n`,
    "utf8"
  );

  console.log(`Merged ${mergedCount} teachables into items.json`);
  if (createdCount > 0) {
    console.log(
      `Created ${createdCount} new item entr${createdCount === 1 ? "y" : "ies"}`
    );
  }
  if (droppedProps.size > 0) {
    console.log(
      `Dropped properties: ${Array.from(droppedProps).sort().join(", ")}`
    );
  }
  const totalRemoved = iconPicRemoved + iconPaletteRemoved + iconPalleteRemoved;
  if (totalRemoved > 0) {
    console.log(
      `Removed ${totalRemoved} icon field${
        totalRemoved === 1 ? "" : "s"
      } (${iconPicRemoved} iconPic, ${iconPaletteRemoved} iconPalette, ${iconPalleteRemoved} iconPallete)`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
