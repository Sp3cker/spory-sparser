#!/usr/bin/env node

import { processAllIcons } from "./IconFrameExtractor.js";

console.log("Starting icon frame extraction...");

processAllIcons()
  .then(() => {
    console.log("Icon processing completed successfully!");
  })
  .catch((error) => {
    console.error("Icon processing failed:", error);
    process.exit(1);
  });
