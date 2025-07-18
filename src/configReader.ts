import * as toml from "toml";
import { z } from "zod";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const ConfigSchema = z.object({
  directories: z.object({
    data: z.string().min(1, "Data directory path cannot be empty"),
    battlePics: z.string().min(1, "Battle pics directory path cannot be empty"),
    sprites: z.string().min(1, "Sprites directory path cannot be empty"),
    maps: z.string().min(1, "Maps directory path cannot be empty"),
    output: z.string().min(1, "Output directory path cannot be empty"),
    miscScripts: z.string().min(1, "Misc scripts directory path cannot be empty"),
  }),
});

export type ConfigType = z.infer<typeof ConfigSchema>;

export class Config {
  public readonly dataDir: string;
  public readonly battlePics: string;
  public readonly sprites: string;
  public readonly rootDir: string = process.cwd();
  public readonly mapsDir: string;
  public readonly outputDir: string;
  public readonly miscScriptsDir: string;
  constructor(configPath: string = "sparser.toml") {
    try {
      // Read and parse the TOML file
      const configFile = readFileSync(resolve(configPath), "utf-8");
      const parsedConfig = toml.parse(configFile);

      // Validate the parsed config against the schema
      const validatedConfig = ConfigSchema.parse(parsedConfig);

      // Assign the validated properties
      this.dataDir = resolve(
        process.cwd(),
        validatedConfig.directories.data.startsWith("/")
          ? validatedConfig.directories.data.slice(1)
          : validatedConfig.directories.data
      );
      this.battlePics = resolve(
        process.cwd(),
        validatedConfig.directories.battlePics.startsWith("/")
          ? validatedConfig.directories.battlePics.slice(1)
          : validatedConfig.directories.battlePics
      );
      this.sprites = resolve(
        process.cwd(),
        validatedConfig.directories.sprites.startsWith("/")
          ? validatedConfig.directories.sprites.slice(1)
          : validatedConfig.directories.sprites
      );
      this.mapsDir = resolve(
        process.cwd(),
        validatedConfig.directories.maps.startsWith("/")
          ? validatedConfig.directories.maps.slice(1)
          : validatedConfig.directories.maps
      );
      this.outputDir = resolve(
        process.cwd(),
        validatedConfig.directories.output.startsWith("/")
          ? validatedConfig.directories.output.slice(1)
          : validatedConfig.directories.output
      );
      this.miscScriptsDir = resolve(
        process.cwd(),
        validatedConfig.directories.miscScripts.startsWith("/")
          ? validatedConfig.directories.miscScripts.slice(1)
          : validatedConfig.directories.miscScripts
      );
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
      battlePics: this.battlePics,
      sprites: this.sprites,
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
