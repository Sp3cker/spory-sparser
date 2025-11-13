import { writeFile, mkdir, access } from "fs/promises";
import { constants } from "fs";
import type { Config } from "../../config/index.ts";
import path from "path";

const writePng =
  (config: Config) =>
  async (
    folder: string,
    filePath: string,
    data: Buffer,
    options: { overwrite?: boolean } = {}
  ) => {
    const { overwrite = false } = options;
    const outPath = path.resolve(config.outputDir, folder, filePath);
    const dir = path.dirname(outPath);

    const relativePath = path.join(folder, filePath);

    if (!overwrite) {
      try {
        await access(outPath, constants.F_OK);
        return relativePath;
      } catch {
        // File missing; continue to write
      }
    }

    // Create directory if it doesn't exist
    await mkdir(dir, { recursive: true });

    await writeFile(outPath, data);
    return relativePath;
  };

export default writePng;
