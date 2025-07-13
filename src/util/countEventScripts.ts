import { readFile } from "fs/promises";

async function countEventScriptGives() {
  try {
    const content = await readFile("./groupedData.json", "utf8");
    const data = JSON.parse(content);

    let eventScriptCount = 0;

    // Iterate through all map entries
    for (const [mapName, levels] of Object.entries(data)) {
      if (Array.isArray(levels)) {
        for (const level of levels) {
          if (level.scriptedGives && Array.isArray(level.scriptedGives)) {
            // Check if any scriptedGive has a scriptName containing "EventScript"
            const hasEventScript = level.scriptedGives.some(
              (give: any) =>
                give.scriptName && give.scriptName.includes("Event Script")
            );

            if (hasEventScript) {
              eventScriptCount++;
              console.log(
                `${level.image || mapName}: Found EventScript scriptedGives`
              );
            }
          }
        }
      }
    }

    console.log(
      `\nTotal levels with EventScript scriptedGives: ${eventScriptCount}`
    );
  } catch (error) {
    console.error("Error analyzing groupedData.json:", error);
  }
}
countEventScriptGives().catch(console.error)