import * as fs from "fs";

interface ParsedStruct {
  id: string;
  [key: string]: any;
}

class CHeaderParser {
  private content: string;
  private defines: Map<string, string> = new Map();
  private stringConstants: Map<string, string> = new Map();

  constructor(content: string) {
    this.content = content;
    this.parseDefines();
    this.parseStringConstants();
  }

  private parseDefines(): void {
    // Parse #define statements
    const defineRegex = /#define\s+([A-Z_][A-Z0-9_]*)\s+(.+)/g;
    let match;

    while ((match = defineRegex.exec(this.content)) !== null) {
      const name = match[1];
      let value = match[2].trim();

      // Handle multi-line defines (basic support)
      if (value.endsWith("\\")) {
        value = value.slice(0, -1).trim();
      }

      this.defines.set(name, value);
    }
  }

  private parseStringConstants(): void {
    // Parse static const u8 string declarations
    const stringRegex =
      /static\s+const\s+u8\s+([A-Za-z_][A-Za-z0-9_]*)\[\]\s*=\s*_\("([^"]+(?:\\.[^"]*)*)"\);/gs;
    let match;

    while ((match = stringRegex.exec(this.content)) !== null) {
      const name = match[1];
      let value = match[2];

      // Handle escaped characters and newlines
      value = value.replace(/\\n/g, " ").replace(/\s+/g, " ").trim();

      this.stringConstants.set(name, value);
    }
  }

  private cleanString(str: string): string {
    // Remove _() wrapper
    str = str.replace(/^_\("(.*)"\)$/, "$1");

    // Handle COMPOUND_STRING
    if (str.includes("COMPOUND_STRING")) {
      // Extract all quoted substrings inside COMPOUND_STRING and join them
      const matches = str.match(/"([^"]*)"/g);
      if (matches) {
        str = matches.map((s) => s.replace(/"/g, "")).join(" ");
      } else {
        str = "";
      }
    }
    // Clean up escaped characters and formatting
    str = str
      .replace(/\\n/g, " ")
      .replace(/\\"/g, '"')
      .replace(/\s+/g, " ")
      .trim();

    return str;
  }

  private resolveValue(value: string): any {
    value = value.trim();

    // Handle numeric values
    if (/^\d+$/.test(value)) {
      return parseInt(value, 10);
    }

    // Handle hex values
    if (/^0x[0-9A-Fa-f]+$/.test(value)) {
      return parseInt(value, 16);
    }

    // Handle string literals
    if (value.startsWith('_("') || value.includes("COMPOUND_STRING")) {
      return this.cleanString(value);
    }

    // Handle references to string constants
    if (this.stringConstants.has(value)) {
      return this.stringConstants.get(value);
    }

    // Handle define substitution
    if (this.defines.has(value)) {
      return this.resolveValue(this.defines.get(value)!);
    }
    const ternaryMatch = value.match(/^\(([^)]+)\)\s*\?\s*([^:]+):\s*([^;]+)$/);
    if (ternaryMatch) {
      // Return the false side, trimmed
      return Number.parseInt(ternaryMatch[3].trim());
    }

    // Return as-is for constants and identifiers
    return value;
  }

  private parseStructEntry(entryText: string): ParsedStruct | null {
    // Extract the item ID from [ITEM_NAME] format
    const idMatch = entryText.match(/\[([A-Z_][A-Z0-9_]*)\]/);
    if (!idMatch) return null;

    const id = idMatch[1];
    const struct: ParsedStruct = { id };

    // Parse struct fields
    const fieldRegex = /\.([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^,}]+)/g;
    let fieldMatch;

    while ((fieldMatch = fieldRegex.exec(entryText)) !== null) {
      const fieldName = fieldMatch[1];
      let fieldValue = fieldMatch[2].trim();

      // Handle multi-line values
      if (fieldValue.includes("\n")) {
        // For COMPOUND_STRING and multi-line strings
        const multiLineMatch = entryText.match(
          new RegExp(
            `\\.${fieldName}\\s*=\\s*([^,}]+(?:[^,}]*\\n[^,}]*)*?)(?=,|\\s*})`,
            "s"
          )
        );
        if (multiLineMatch) {
          fieldValue = multiLineMatch[1].trim();
        }
      }

      struct[fieldName] = this.resolveValue(fieldValue);
    }
    if (struct.id.startsWith("ITEM_TM_")) {
      // Derive TM name: text after TM_, remove _, Capital Case
      const tmName = struct.id
        .replace("ITEM_TM_", "")
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      // Get TM number from name if present
      // const tmNumberMatch = struct.name.match(/TM(\\d+)/);
      // const tmNumber = tmNumberMatch ? tmNumberMatch[1] : "";
      struct.name = `${struct.name} - ${tmName}`;
    }
    if (struct.id.startsWith("ITEM_HM_")) {
      const hmName = struct.id
        .replace("ITEM_HM_", "")
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      // const hmNumberMatch = struct.name.match(/HM(\\d+)/);
      // const hmNumber = hmNumberMatch ? hmNumberMatch[1] : "";
      struct.name = `${struct.name} - ${hmName}`;
    }
    if (typeof struct.price === "string") {
      const match = struct.price.match(/^(\d+)\s*\*/);
      if (match) {
        struct.price = Number.parseInt(match[1]);
        // You can use 'value' as needed here
      }
    }
    return struct;
  }

  parseStructArray(structName: string = "gItemsInfo"): ParsedStruct[] {
    const results: ParsedStruct[] = [];

    console.error(`Looking for struct: ${structName}`);
    console.error(`File length: ${this.content.length} characters`);

    // Find the struct array declaration with more flexible regex
    const structRegex = new RegExp(
      `const\\s+struct\\s+\\w+\\s+${structName}\\s*\\[\\]\\s*=\\s*\\{`,
      "i"
    );

    const structMatch = this.content.match(structRegex);
    if (!structMatch) {
      console.error(`Could not find struct array: ${structName}`);

      // Debug: Show what struct declarations we can find
      const anyStructRegex = /const\s+struct\s+\w+\s+(\w+)\s*\[\]\s*=/gi;
      let debugMatch;
      console.error("Found these struct arrays:");
      while ((debugMatch = anyStructRegex.exec(this.content)) !== null) {
        console.error(`  - ${debugMatch[1]}`);
      }

      return results;
    }

    console.error(`Found struct declaration at position: ${structMatch.index}`);

    // Extract the full struct content by finding matching braces
    const startPos = structMatch.index! + structMatch[0].length;
    let braceCount = 1;
    let endPos = startPos;

    for (let i = startPos; i < this.content.length && braceCount > 0; i++) {
      const char = this.content[i];
      if (char === "{") braceCount++;
      else if (char === "}") braceCount--;
      endPos = i;
    }

    const structContent = this.content.substring(startPos, endPos);
    console.error(`Extracted struct content length: ${structContent.length}`);
    console.error(`First 200 chars: ${structContent.substring(0, 200)}...`);

    // Now parse the entries
    console.error("Parsing entries...");

    // Split into individual entries
    const entries: string[] = [];
    braceCount = 0;
    let currentEntry = "";
    let inEntry = false;

    for (let i = 0; i < structContent.length; i++) {
      const char = structContent[i];

      if (char === "[" && !inEntry) {
        inEntry = true;
        currentEntry = char;
      } else if (inEntry) {
        currentEntry += char;

        if (char === "{") {
          braceCount++;
        } else if (char === "}") {
          braceCount--;
          if (braceCount === 0) {
            entries.push(currentEntry.trim());
            currentEntry = "";
            inEntry = false;
          }
        }
      }
    }

    console.error(`Found ${entries.length} entries`);

    // Parse each entry
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (entry.trim()) {
        console.error(`Parsing entry ${i + 1}: ${entry.substring(0, 50)}...`);
        const parsed = this.parseStructEntry(entry);
        if (parsed) {
          results.push(parsed);
          console.error(`Successfully parsed: ${parsed.id}`);
        } else {
          console.error(`Failed to parse entry ${i + 1}`);
        }
      }
    }

    console.error(`Total parsed entries: ${results.length}`);
    return results;
  }
}

function parseHeaderFile(filePath: string): ParsedStruct[] {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const parser = new CHeaderParser(content);
    return parser.parseStructArray("gItemsInfo");
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    return [];
  }
}

function parseHeaderContent(
  content: string,
  structName: string = "gItemsInfo"
): ParsedStruct[] {
  const parser = new CHeaderParser(content);
  return parser.parseStructArray(structName);
}

// Main execution
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: ts-node script.ts <header-file-path> [struct-name]");
    console.error("Example: ts-node script.ts items.h gItemsInfo");
    process.exit(1);
  }

  const filePath = args[0];
  // const structName = args[1] || "gItemsInfo";

  if (!fs.existsSync(filePath)) {
    console.error(`File does not exist: ${filePath}`);
    process.exit(1);
  }

  const structs = parseHeaderFile(filePath);
  const unwantedKeys = [
    "pocket",
    "type",
    "battleUsage",
    "secondaryId",

    "fieldUseFunc",
  ];

  for (const struct of structs) {
    for (const key of unwantedKeys) {
      delete struct[key];
    }
  }
  fs.writeFileSync("items.json", JSON.stringify(structs, null, 2));
}

// Export functions for library use
export { CHeaderParser, parseHeaderFile, parseHeaderContent, ParsedStruct };

// Run main if this file is executed directly
(() => main())();
