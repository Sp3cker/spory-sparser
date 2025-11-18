import path, { basename, extname } from "path";
import { config } from "../config/index.ts";
import { readFile, copyFile } from "fs/promises";
import {
  PaletteApplier,
  PaletteEntry,
} from "./PaletteApplier/PaletteApplier.ts";

(async () => {
  const applier = new PaletteApplier({ config });

  const teachables = await readFile(
    path.resolve(config.dataDir, "teachables.json"),
    "utf-8"
  ).then((data) => JSON.parse(data));

  const tmSpriteTypeNames = teachables
    .map((t: any) => basename(t.iconType.toLowerCase(), extname(t.iconType)))
    .filter(Boolean);

  const pathsToTmSprites = tmSpriteTypeNames.map((imgName: string) =>
    path.resolve(config.sprites, "items/icons/scrolls", `${imgName}.png`)
  );

  const uniqueTmSpritePaths = new Set<string>(pathsToTmSprites);

  const palettes = new Map<string, PaletteEntry[]>();
  tmSpriteTypeNames.forEach((typeName: string) => {
    const palettePath = path.resolve(
      config.sprites,
      "items/icons/scrolls",
      `${typeName}.gbapal`
    );
    const jascPalettes = applier.readPalette(palettePath);
    palettes.set(typeName, jascPalettes);
  });
  const paletizedSpritePaths: string[] = [];
  for (const imgPath of uniqueTmSpritePaths) {
    const image = await readFile(imgPath);
    const paletizedImage = applier.applyPalette(
      image,
      palettes.get(basename(imgPath, extname(imgPath)).toLowerCase())!
    );
    const newpath = await applier.writePng(
      "items/icons/tms_applied",
      basename(imgPath),
      paletizedImage,
      { overwrite: true }
    );
    paletizedSpritePaths.push(newpath);
  }

  // Paletized sprites are written.
  // Now we have to read the iconType for each TM
  // and copy that matching sprite to the `processed` folder
  // and name it the ID of the TM.

  const tmIdsAndTypes: { id: number; iconType: string }[] = teachables.map(
    (t: any) => ({
      id: t.itemId,
      iconType: basename(
        t.iconType.toLowerCase(),
        extname(t.iconType)
      ),
    })
  );
  for (const tm of tmIdsAndTypes) {
    console.log(tm.id, tm.iconType);
    let thisTmsSpritePath = paletizedSpritePaths.find(
      (p) => basename(p, extname(p)) === tm.iconType
    );

    if (!thisTmsSpritePath) {
      console.warn(
        `No sprite found for TM ID ${tm.id} with type ${tm.iconType}`
      );
      continue;
    }

    const destinationPath = path.resolve(
      config.outputDir,
      "items/icons/scrolls",
      `${tm.id}.png`
    );

    await copyFile(path.resolve(config.outputDir,thisTmsSpritePath), destinationPath);
  }
  return pathsToTmSprites;
})();
