import { writeFile, mkdir } from "fs/promises";
import type { Config } from "../config/index.js";
import path from "path";

const writePng =
  (config: Config) =>
  async (folder: string, filePath: string, data: Buffer) => {
    const outPath = path.resolve(config.outputDir, folder, filePath);
    const dir = path.dirname(outPath);
    
    // Create directory if it doesn't exist
    await mkdir(dir, { recursive: true });
    
    await writeFile(outPath, data);
    return outPath;
  };

export default writePng;
