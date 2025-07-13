import { readFile, writeFile } from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const hPath = path.join(__dirname, "..", "data/item_descriptions.h");
  const jsonPath = path.join(__dirname, "..", "data/items.json");

  const hText = await readFile(hPath, "utf8");
  const jsonText = await readFile(jsonPath, "utf8");
  const items = JSON.parse(jsonText);

  // Parse all sXXXDesc structs
  const structRegex =
    /static const u8 (s\w+Desc)\[\] = _\(([\s\S]*?)(?=static const u8|\n\/\/|\n#|$)/g;
  const structs: Record<string, string> = {};

  let match: RegExpExecArray | null;
  while ((match = structRegex.exec(hText))) {
    const [_, name, body] = match;

    // Handle #if ... #else ... #endif
    let desc = body;
    if (/#if[\s\S]+?#else[\s\S]+?#endif/.test(body)) {
      // Only use the text after #if and before #else
      const ifMatch = body.match(/#if[^\n]*\n([\s\S]+?)#else/);
      desc = ifMatch ? ifMatch[1] : desc;
    }

    // Remove any #if/#else/#endif lines
    desc = desc.replace(/#if[^\n]*\n?|#else\n?|#endif\n?/g, "");

    // Remove trailing );
    desc = desc.replace(/\);?\s*$/, "");

    // Remove leading/trailing whitespace
    desc = desc.trim();

    // Concatenate all quoted lines into one string
    // e.g. "line1\n"    "line2\n" => line1\nline2
    let text = "";
    const lineRegex = /"([^"]*)"/g;
    let lineMatch: RegExpExecArray | null;
    while ((lineMatch = lineRegex.exec(desc))) {
      text += lineMatch[1];
    }
    // Replace \n with space, trim
    text = text.replace(/\\n/g, " ").replace(/\s+/g, " ").trim();

    structs[name] = text;
  }

  // Update items.json
  for (const item of items) {
    if (
      typeof item.id === "string" &&
      item.id.startsWith("ITEM_TM_") &&
      typeof item.description === "string" &&
      structs[item.description]
    ) {
      item.description = structs[item.description];
    }
  }
  for (const item of items) {// Check for any other items that might have a description
    if (typeof item.description === "string" && structs[item.description]) {
      item.description = structs[item.description];
    }
  }

  await writeFile("deez.json", JSON.stringify(items, null, 4), "utf8");
  console.log("TM descriptions updated in items.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
