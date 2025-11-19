import path, { basename, extname } from "path";
import { config } from "../config/index.ts";
import { promises as fs } from "fs";
import { readFile, copyFile } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import {
  PaletteApplier,
  PaletteEntry,
} from "./PaletteApplier/PaletteApplier.ts";

const execAsync = promisify(exec);

async function writeWebp(input: Buffer, outputPath: string): Promise<void> {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const tempInput = `/tmp/cwebp_input_${timestamp}_${random}.png`;

  try {
    await fs.writeFile(tempInput, input);
  } catch (error) {
    throw new Error(`Failed to prepare WEBP input for ${outputPath}: ${error}`);
  }

  const cmd = `cwebp -quiet -q 100 -m 6 -hint picture -near_lossless 100 -mt "${tempInput}" -o "${outputPath}"`;
  try {
    await execAsync(cmd);
  } catch (error) {
    throw new Error(`Failed to write WEBP to ${outputPath}: ${error}`);
  } finally {
    try {
      await fs.unlink(tempInput);
    } catch {
      // ignore cleanup errors
    }
  }
}

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
    
    // Convert PNG to WebP
    const webpPath = path.resolve(
      config.outputDir,
      "items/icons/tms_applied",
      basename(imgPath).replace(/\.png$/i, ".webp")
    );
    await writeWebp(paletizedImage, webpPath);
    
    paletizedSpritePaths.push(newpath);
  }

  // Paletized sprites are written.
  // Now we have to read the iconType for each TM
  // and copy that matching sprite to the `processed` folder
  // and name it the ID of the TM.

  const tmIdsAndTypes: { id: number; iconType: string }[] = teachables.map(
    (t: any) => ({
      id: t.itemId,
      iconType: basename(t.iconType.toLowerCase(), extname(t.iconType)),
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
      "items/processed",
      `${tm.id}.png`
    );

    await copyFile(
      path.resolve(config.outputDir, thisTmsSpritePath),
      destinationPath
    );

    // Also copy the WebP version
    const webpSource = thisTmsSpritePath.replace(/\.png$/i, ".webp");
    const webpDest = path.resolve(
      config.outputDir,
      "items/processed",
      `${tm.id}.webp`
    );
    
    try {
      await copyFile(
        path.resolve(config.outputDir, webpSource),
        webpDest
      );
    } catch (error) {
      console.warn(`Failed to copy WebP for TM ${tm.id}: ${error}`);
    }
  }
  return pathsToTmSprites;
})();
