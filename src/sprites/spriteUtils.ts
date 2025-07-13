// Shared utilities for sprite generation
import { readFile, writeFile } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import { join } from "path";

const execAsync = promisify(exec);

export interface Color {
  r: number;
  g: number;
  b: number;
}

export interface JascPalette {
  colors: Color[];
}

export interface ItemFromJson {
  id: string;
  name: string;
  iconPalette?: string;
  iconPic?: string;
  price?: number;
  description?: string;
  importance?: string;
}

/**
 * Parse JASC-PAL format palette file
 */
export async function parseJascPalette(filePath: string): Promise<JascPalette> {
  try {
    const content = await readFile(filePath, "utf8");
    const lines = content
      .trim()
      .split("\n")
      .map((line) => line.trim());

    if (lines[0] !== "JASC-PAL") {
      throw new Error(
        `Invalid JASC-PAL file: ${filePath} - Expected "JASC-PAL", got "${lines[0]}"`
      );
    }

    const colorCount = parseInt(lines[2]);
    const colors: Color[] = [];

    for (let i = 3; i < 3 + colorCount && i < lines.length; i++) {
      const colorLine = lines[i].trim();
      if (colorLine) {
        const [r, g, b] = colorLine.split(" ").map((n) => parseInt(n));
        colors.push({ r, g, b });
      }
    }

    return { colors };
  } catch (error) {
    console.error(`Error parsing palette ${filePath}:`, error);
    throw error;
  }
}

/**
 * Apply palette using ImageMagick with proper indexed color handling
 */
export async function applyPaletteWithImageMagick(
  baseImagePath: string,
  palette: JascPalette,
  outputPath: string,
  debugMode = false
): Promise<void> {
  try {
    const paletteColors = palette.colors;

    // Create temporary files for the process
    const tempDir = "/tmp";
    const timestamp = Date.now();
    const debugDir = debugMode ? `${tempDir}/sprite_debug_${timestamp}` : null;

    // Always save analysis files
    const projectDebugDir = join(process.cwd(), "debug-clut");
    const paletteAnalysisPath = `${projectDebugDir}/palette_${timestamp}.txt`;

    // Create debug directory if in debug mode
    if (debugMode && debugDir) {
      await execAsync(`mkdir -p "${debugDir}"`);
    }

    // Save palette analysis
    const paletteAnalysis = paletteColors
      .map((color, i) => {
        const isTransparent =
          color.r === 255 && color.g === 0 && color.b === 128;
        return `${i}: rgb(${color.r},${color.g},${color.b}) ${
          isTransparent ? "(TRANSPARENT)" : ""
        }`;
      })
      .join("\n");

    await writeFile(paletteAnalysisPath, paletteAnalysis);
    console.log(`Saved palette analysis to: ${paletteAnalysisPath}`);

    // Create a colormap text file for ImageMagick
    // Format: "index: (r,g,b,a)"
    const colorMapEntries = paletteColors.map((color, i) => {
      const isTransparent = color.r === 255 && color.g === 0 && color.b === 128;
      const alpha = isTransparent ? 0 : 255;
      return `  ${i}: (${color.r},${color.g},${color.b},${alpha})`;
    });

    const colorMapContent = `# Colormap generated from palette\nColormap entries: ${
      paletteColors.length
    }\nColormap:\n${colorMapEntries.join("\n")}`;
    await writeFile(
      `${projectDebugDir}/colormap_${timestamp}.txt`,
      colorMapContent
    );
debugger
    // The correct approach: Extract the current colors from the base image first,
    // then replace each with the corresponding palette color by index

    // First, get the colormap from the base image
    const { stdout: baseImageInfo } = await execAsync(
      `magick identify -verbose "${baseImagePath}"`
    );
    const baseColormap = extractColormapFromImageInfo(baseImageInfo);

    if (!baseColormap || baseColormap.length === 0) {
      throw new Error(
        `Could not extract colormap from base image: ${baseImagePath}`
      );
    }

    console.log(`Base image has ${baseColormap.length} colors in colormap`);
    console.log(`Palette has ${paletteColors.length} colors`);

    // Build the command to replace each base color with the corresponding palette color
    let command = `magick "${baseImagePath}"`;

    // Handle transparency first if the palette has it
    const hasTransparentColor =
      paletteColors[0].r === 255 &&
      paletteColors[0].g === 0 &&
      paletteColors[0].b === 128;
    if (hasTransparentColor) {
      // If first palette color is transparent magenta, make the first base color transparent
      if (baseColormap[0]) {
        command += ` -alpha set -transparent "rgb(${baseColormap[0].r},${baseColormap[0].g},${baseColormap[0].b})"`;
      }
    }

    // Replace each base color with its corresponding palette color
    const maxColors = Math.min(baseColormap.length, paletteColors.length);
    for (let i = 0; i < maxColors; i++) {
      const baseColor = baseColormap[i];
      const paletteColor = paletteColors[i];

      // Skip transparent colors as they're handled above
      const isTransparentPalette =
        paletteColor.r === 255 &&
        paletteColor.g === 0 &&
        paletteColor.b === 128;
      if (isTransparentPalette) continue;

      // Replace base color with palette color
      command += ` -fill "rgb(${paletteColor.r},${paletteColor.g},${paletteColor.b})" -opaque "rgb(${baseColor.r},${baseColor.g},${baseColor.b})"`;
    }

    command += ` "${outputPath}"`;

    console.log(
      `Applied palette using direct color replacement (${maxColors} colors mapped)`
    );
    if (debugMode) {
      console.log(`Command: ${command}`);
    }

    await execAsync(command);

    if (debugMode) {
      console.log(`Debug: Applied palette with ${paletteColors.length} colors`);
      console.log(
        `Debug: First color: rgb(${paletteColors[0].r},${paletteColors[0].g},${paletteColors[0].b})`
      );

      if (debugDir) {
        // Save intermediate steps for debugging
        const baseAnalysisPath = `${debugDir}/base_analysis.txt`;
        const resultAnalysisPath = `${debugDir}/result_analysis.txt`;

        await execAsync(
          `magick identify -verbose "${baseImagePath}" > "${baseAnalysisPath}"`
        );
        await execAsync(
          `magick identify -verbose "${outputPath}" > "${resultAnalysisPath}"`
        );

        console.log(`Debug: Saved base image analysis to ${baseAnalysisPath}`);
        console.log(
          `Debug: Saved result image analysis to ${resultAnalysisPath}`
        );
      }
    }

    // Clean up temporary files (but keep debug files if in debug mode)
    try {
      if (!debugMode && debugDir) {
        await execAsync(`rm -rf "${debugDir}"`);
      }
    } catch (cleanupError) {
      console.warn("Failed to clean up temporary files:", cleanupError);
    }
  } catch (error) {
    console.error(`Error applying palette with ImageMagick:`, error);
    throw error;
  }
}

/**
 * Convert CamelCase to underscore_case
 * e.g., MagmaEmblem -> magma_emblem
 */
export function camelToUnderscore(str: string): string {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, ""); // Remove leading underscore
}

/**
 * Transform iconPalette property to palette filename
 * e.g., gItemIconPalette_MagmaEmblem -> magma_emblem.pal
 */
export function iconPaletteToFilename(iconPalette: string): string {
  // Remove gItemIconPalette_ prefix
  const withoutPrefix = iconPalette.replace(/^gItemIconPalette_/, "");
  // Convert to underscore_case and add .pal extension
  return `${camelToUnderscore(withoutPrefix)}.pal`;
}

/**
 * Transform iconPic property to base image filename
 * e.g., gItemIcon_Vitamin -> vitamin.png
 */
export function iconPicToFilename(iconPic: string): string {
  // Remove gItemIcon_ prefix, lowercase, and add .png extension
  return `${iconPic.replace(/^gItemIcon_/, "").toLowerCase()}.png`;
}

/**
 * Extract colormap from ImageMagick identify output
 */
function extractColormapFromImageInfo(imageInfo: string): Color[] {
  const colors: Color[] = [];
  const lines = imageInfo.split("\n");

  let inColormap = false;
  for (const line of lines) {
    if (line.includes("Colormap:")) {
      inColormap = true;
      continue;
    }

    if (inColormap) {
      // Look for lines like "    0: (255,0,128,0) #FF008000 srgba(255,0,128,0)"
      const match = line.match(/^\s*\d+:\s*\((\d+),(\d+),(\d+)(?:,\d+)?\)/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        colors.push({ r, g, b });
      } else if (line.trim() && !line.includes(":")) {
        // End of colormap section
        break;
      }
    }
  }

  return colors;
}
