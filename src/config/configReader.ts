import * as toml from "toml";
import { z } from "zod";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { ConfigSchema, type ConfigType } from "./configSchema.js";

export type { ConfigType };

export class Config {
  public readonly dataDir: string;
  public readonly sprites: string;
  public readonly rootDir: string = process.cwd();
  public readonly mapsDir: string;
  public readonly outputDir: string;
  public readonly miscScriptsDir: string;

  public readonly trainerPalettesDir: string;
  public readonly trainerFrontPicsDir: string;

  public readonly itemIconsDir: string;
  public readonly itemPalettesDir: string;
  public readonly itemOutputDir: string;
  public readonly pokemonSpritesDir: string;

  private resolveDir(dir: string): string {
    return resolve(process.cwd(), dir.startsWith("/") ? dir.slice(1) : dir);
  }

  constructor(configPath: string = "sparser.toml") {
    try {
      // Read and parse the TOML file
      const configFile = readFileSync(resolve(configPath), "utf-8");
      const parsedConfig = toml.parse(configFile);

      // Validate the parsed config against the schema
      const validatedConfig = ConfigSchema.parse(parsedConfig);

      // Assign the validated properties
      const dirs = validatedConfig.directories;

      this.dataDir = this.resolveDir(dirs.data);
      this.sprites = this.resolveDir(dirs.sprites);
      this.mapsDir = this.resolveDir(dirs.maps);
      this.outputDir = this.resolveDir(dirs.output);
      this.miscScriptsDir = this.resolveDir(dirs.miscScripts);

      const trainerSpritesDir = resolve(this.sprites, "trainers");
      this.trainerFrontPicsDir = resolve(trainerSpritesDir, "front_pics");
      this.trainerPalettesDir = resolve(trainerSpritesDir, "palettes");

      const itemSpritesDir = resolve(this.sprites, "items");
      this.itemIconsDir = resolve(itemSpritesDir, "icons");
      this.itemPalettesDir = resolve(itemSpritesDir, "icon_palettes");
      this.itemOutputDir = resolve(this.outputDir, "icons");

      this.pokemonSpritesDir = resolve(this.sprites, "pokemon");

      // Validate that all directories exist
      this.validateDirectoriesExist();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Configuration validation failed: ${error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", ")}`
        );
      } else if (error instanceof Error) {
        throw new Error(
          `Failed to read or parse configuration file: ${error.message}`
        );
      } else {
        throw new Error("Unknown error occurred while reading configuration");
      }
    }
  }

  /**
   * Validates that all configured directories exist
   * @throws Error if any directory doesn't exist
   */
  private validateDirectoriesExist(): void {
    const directories = {
      dataDir: this.dataDir,
      spritesRoot: this.sprites,

      trainerFrontPics: this.trainerFrontPicsDir,
      trainerPalettes: this.trainerPalettesDir,

      itemIcons: this.itemIconsDir,
      itemPalettes: this.itemPalettesDir,
      pokemonSprites: this.pokemonSpritesDir,
      maps: this.mapsDir,
      generated: resolve(this.rootDir, "generated"),
      miscScripts: this.miscScriptsDir,
    };

    const missingDirectories: string[] = [];

    for (const [name, path] of Object.entries(directories)) {
      if (!existsSync(path)) {
        missingDirectories.push(`${name}: ${path}`);
      }
    }

    if (missingDirectories.length > 0) {
      throw new Error(
        `The following configured directories do not exist:\n${missingDirectories
          .map((dir) => `  - ${dir}`)
          .join("\n")}`
      );
    }
  }

  /**
   * Static method to create a Config instance
   */
  static load(configPath?: string): Config {
    return new Config(configPath);
  }
}

export const config = Config.load();
