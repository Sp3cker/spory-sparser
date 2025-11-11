import { writeFile, mkdir, access } from "fs/promises";
import { constants } from "fs";
import type { Config } from "../../config/index.ts";
import path from "path";

const writePng =
  (config: Config) =>
  async (folder: string, filePath: string, data: Buffer) => {
    const outPath = path.resolve(config.outputDir, folder, filePath);
    const dir = path.dirname(outPath);
    
    // Check if file already exists
    try {
      await access(outPath, constants.F_OK);
      // File exists, skip writing
      return outPath;
    } catch {
      // File doesn't exist, proceed with writing
    }
    
    // Create directory if it doesn't exist
    await mkdir(dir, { recursive: true });
    
    await writeFile(outPath, data);
    return path.join(folder, filePath);
  };

export default writePng;
