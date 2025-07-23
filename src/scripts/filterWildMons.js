import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

(async () => {
  try {
    const inputFilePath = resolve("generated/give_items.json"); // Adjust path if needed
    const outputFilePath = resolve("generated/filtered_give_items.json");

    // Read and parse the JSON file
    const data = JSON.parse(readFileSync(inputFilePath, "utf8"));

    // Transform the data to keep only the wildMons property
    const filteredData = data.map(
      (value) => value.wildMons || null // Keep wildMons or set to null if undefined
    );

    // Write the filtered data to a new file
    writeFileSync(outputFilePath, JSON.stringify(filteredData, null, 2));

    console.log(`Filtered data written to ${outputFilePath}`);
  } catch (error) {
    console.error("Error filtering wildMons:", error);
  }
})();
