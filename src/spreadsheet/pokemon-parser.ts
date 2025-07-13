import * as XLSX from 'xlsx';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Pokemon ROM Data Parser
 * 
 * Parses Pokemon gift and legendary data from Excel files
 * Outputs clean objects with location, pokemon, and flavor properties
 */

interface PokemonEntry {
  location: string;
  pokemon: string;
  flavor: string;
}

interface ParsedData {
  extractedAt: string;
  gifts: PokemonEntry[];
  legendaries: PokemonEntry[];
  totalEntries: number;
}

class PokemonDataParser {
  private inputPath: string;
  private outputDir: string;

  constructor(inputPath: string, outputDir: string = './data/pokemon-data') {
    this.inputPath = inputPath;
    this.outputDir = outputDir;
  }

  async parse(): Promise<ParsedData> {
    console.log('🎮 Starting Pokemon ROM Data Parsing');
    console.log('====================================');
    console.log(`📁 Input file: ${this.inputPath}`);
    console.log(`💾 Output directory: ${this.outputDir}`);

    // Verify input file exists
    try {
      await fs.access(this.inputPath);
    } catch (error) {
      throw new Error(`Input file not found: ${this.inputPath}`);
    }

    // Read the Excel file
    console.log('\n📖 Reading Excel file...');
    const workbook = XLSX.readFile(this.inputPath);
    
    console.log(`✅ Successfully loaded workbook`);
    console.log(`📄 Found ${workbook.SheetNames.length} sheet(s): ${workbook.SheetNames.join(', ')}`);

    // Parse gifts and eggs
    const gifts = this.parseGiftsSheet(workbook);
    console.log(`🎁 Parsed ${gifts.length} gift entries`);

    // Parse legendaries
    const legendaries = this.parseLegendariesSheet(workbook);
    console.log(`⭐ Parsed ${legendaries.length} legendary entries`);

    const parsedData: ParsedData = {
      extractedAt: new Date().toISOString(),
      gifts,
      legendaries,
      totalEntries: gifts.length + legendaries.length
    };

    // Save to files
    await this.saveToFiles(parsedData);

    console.log('\n🎉 Pokemon data parsing completed successfully!');
    console.log('==============================================');
    console.log(`🎁 Gift entries: ${gifts.length}`);
    console.log(`⭐ Legendary entries: ${legendaries.length}`);
    console.log(`📊 Total entries: ${parsedData.totalEntries}`);
    console.log(`💾 Files saved to: ${this.outputDir}`);

    return parsedData;
  }

  private parseGiftsSheet(workbook: XLSX.WorkBook): PokemonEntry[] {
    const sheetName = 'Gifts and Eggs';
    console.log(`\n🔍 Processing ${sheetName} sheet...`);
    
    if (!workbook.Sheets[sheetName]) {
      console.log(`⚠️  Sheet "${sheetName}" not found, skipping...`);
      return [];
    }

    const worksheet = workbook.Sheets[sheetName];
    const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1,
      defval: null,
      raw: false
    });

    if (rawData.length <= 1) {
      console.log(`⚠️  No data rows found in ${sheetName}`);
      return [];
    }

    // Find header indices
    const headers = rawData[0];
    const locationIndex = this.findHeaderIndex(headers, ['LOCATION', 'location']);
    const pokemonIndex = this.findHeaderIndex(headers, ['GIFT', 'gift', 'POKEMON', 'pokemon']);
    const flavorIndex = this.findHeaderIndex(headers, ['FLAVOR', 'flavor']);

    console.log(`   📝 Found headers - Location: ${locationIndex}, Pokemon: ${pokemonIndex}, Flavor: ${flavorIndex}`);

    const gifts: PokemonEntry[] = [];
    
    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];
      
      const location = this.cleanValue(row[locationIndex]);
      const pokemon = this.cleanValue(row[pokemonIndex]);
      const flavor = this.cleanValue(row[flavorIndex]);

      // Skip empty rows
      if (!location && !pokemon) continue;

      gifts.push({
        location: location || 'Unknown Location',
        pokemon: pokemon || 'Unknown Pokemon',
        flavor: flavor || ''
      });
    }

    return gifts;
  }

  private parseLegendariesSheet(workbook: XLSX.WorkBook): PokemonEntry[] {
    const sheetName = 'LegendariesMythicals';
    console.log(`\n🔍 Processing ${sheetName} sheet...`);
    
    if (!workbook.Sheets[sheetName]) {
      console.log(`⚠️  Sheet "${sheetName}" not found, skipping...`);
      return [];
    }

    const worksheet = workbook.Sheets[sheetName];
    const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1,
      defval: null,
      raw: false
    });

    if (rawData.length <= 1) {
      console.log(`⚠️  No data rows found in ${sheetName}`);
      return [];
    }

    // Find header indices
    const headers = rawData[0];
    const pokemonIndex = this.findHeaderIndex(headers, ['POKEMON', 'pokemon']);
    const locationIndex = this.findHeaderIndex(headers, ['LOCATION', 'location']);
    const requiredIndex = this.findHeaderIndex(headers, ['REQUIRED', 'required', 'FLAVOR', 'flavor']);

    console.log(`   📝 Found headers - Pokemon: ${pokemonIndex}, Location: ${locationIndex}, Required/Flavor: ${requiredIndex}`);

    const legendaries: PokemonEntry[] = [];
    
    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];
      
      const pokemon = this.cleanValue(row[pokemonIndex]);
      const location = this.cleanValue(row[locationIndex]);
      const required = this.cleanValue(row[requiredIndex]);

      // Skip empty rows
      if (!pokemon && !location) continue;

      // Create flavor text from location and required fields
      let flavor = '';
      if (required && location) {
        flavor = `${required} - ${location}`;
      } else if (location) {
        flavor = location;
      } else if (required) {
        flavor = required;
      }

      legendaries.push({
        location: this.extractLocationFromText(location) || 'Unknown Location',
        pokemon: pokemon || 'Unknown Pokemon',
        flavor: flavor
      });
    }

    return legendaries;
  }

  private findHeaderIndex(headers: any[], searchTerms: string[]): number {
    for (const term of searchTerms) {
      const index = headers.findIndex(header => 
        header && String(header).toUpperCase().includes(term.toUpperCase())
      );
      if (index !== -1) return index;
    }
    return -1;
  }

  private cleanValue(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value).trim();
  }

  private extractLocationFromText(text: string): string {
    if (!text) return '';
    
    // Handle common Pokemon ROM flavor text patterns
    
    // Pattern: "Badge X - Lv. Y - Location, description"
    const badgeLevelLocationMatch = text.match(/Badge\s+\d+\s*-\s*Lv\.\s*\d+(?:-\d+)?\s*-\s*([^,]+)(?:,|$)/i);
    if (badgeLevelLocationMatch) {
      return badgeLevelLocationMatch[1].trim();
    }
    
    // Pattern: "Postgame - Lv. Y - Location, description"
    const postgameLevelLocationMatch = text.match(/Postgame\s*-\s*Lv\.\s*\d+(?:-\d+)?\s*-\s*([^,]+)(?:,|$)/i);
    if (postgameLevelLocationMatch) {
      return postgameLevelLocationMatch[1].trim();
    }
    
    // Pattern: "Victory Road - Lv. Y - Description mentioning location"
    if (text.includes("Victory Road") && text.includes("Roams around Hoenn")) {
      return "Hoenn";
    }
    
    // Pattern: "If you have X - Description"
    if (text.startsWith("If you have")) {
      // Look for specific location mentions
      const ifLocationMatch = text.match(/(?:at|in|on|use it on|claim it on)\s+([A-Z][A-Za-z\s]+?)(?:\s*[,.]|\s*$)/i);
      if (ifLocationMatch) {
        return ifLocationMatch[1].trim();
      }
      // For evolution items, return the action itself
      if (text.includes("Evolve")) {
        const evolveMatch = text.match(/Evolve\s+([A-Za-z\s:-]+?)(?:\s*\(|$)/i);
        if (evolveMatch) {
          return `Evolve ${evolveMatch[1].trim()}`;
        }
      }
      // For key items, return the action
      const keyItemMatch = text.match(/Use\s+([A-Za-z\s]+?)\s+Key Item/i);
      if (keyItemMatch) {
        return `Use ${keyItemMatch[1].trim()} Key Item on ${text.match(/on\s+([A-Za-z-]+)/i)?.[1] || 'Pokemon'}`;
      }
    }
    
    // Pattern: "- - Unavailable"
    if (text.includes("Unavailable")) {
      return "Unavailable";
    }
    
    // Pattern: Direct location mentions
    const locationPatterns = [
      /(Route\s*\d+)/i,
      /(Victory Road|Safari Zone|Mt\.\s*\w+|Lake\s*\w+)/i,
      /([A-Z][A-Za-z]+\s+City)/i,
      /(Birth Island|Faraway Island|Southern Island|Navel Rock)/i,
      /(Devon Corporation|Abandoned Ship|Rusturf Tunnel|New Mauville)/i,
      /(Granite Cave|Shoal Cave|Meteor Falls|Sky Pillar|Artisan Cave)/i,
      /(Magma Hideout|Seafloor Cavern|Mt\. Pyre|Mt\. Chimney)/i
    ];

    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    
    // If no specific pattern matches, try to extract the first meaningful location
    // after common prefixes
    const cleanedText = text.replace(/^(Badge\s+\d+\s*-\s*|Postgame\s*-\s*|Victory Road\s*-\s*)?(Lv\.\s*\d+(?:-\d+)?\s*-\s*)?/i, '');
    const parts = cleanedText.split(/[,;]/);
    if (parts.length > 0 && parts[0].trim()) {
      return parts[0].trim();
    }

    return text;
  }

  private async saveToFiles(data: ParsedData): Promise<void> {
    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true });

    // Save complete data
    const completeFile = path.join(this.outputDir, 'pokemon_data_complete.json');
    await fs.writeFile(completeFile, JSON.stringify(data, null, 2));
    console.log(`💾 Complete data saved to: ${completeFile}`);

    // Save gifts only
    const giftsFile = path.join(this.outputDir, 'gifts_and_eggs.json');
    await fs.writeFile(giftsFile, JSON.stringify({
      extractedAt: data.extractedAt,
      count: data.gifts.length,
      entries: data.gifts
    }, null, 2));
    console.log(`🎁 Gifts data saved to: ${giftsFile}`);

    // Save legendaries only
    const legendariesFile = path.join(this.outputDir, 'legendaries_and_mythicals.json');
    await fs.writeFile(legendariesFile, JSON.stringify({
      extractedAt: data.extractedAt,
      count: data.legendaries.length,
      entries: data.legendaries
    }, null, 2));
    console.log(`⭐ Legendaries data saved to: ${legendariesFile}`);

    // Save TypeScript interface file
    const interfaceFile = path.join(this.outputDir, 'pokemon_data.d.ts');
    const interfaceContent = `// Generated Pokemon ROM data types
export interface PokemonEntry {
  location: string;
  pokemon: string;
  flavor: string;
}

export interface PokemonDataSet {
  extractedAt: string;
  count: number;
  entries: PokemonEntry[];
}

export interface CompletePokemonData {
  extractedAt: string;
  gifts: PokemonEntry[];
  legendaries: PokemonEntry[];
  totalEntries: number;
}
`;
    await fs.writeFile(interfaceFile, interfaceContent);
    console.log(`📝 TypeScript definitions saved to: ${interfaceFile}`);

    // Create summary
    const summary = {
      extractedAt: data.extractedAt,
      summary: {
        gifts: data.gifts.length,
        legendaries: data.legendaries.length,
        total: data.totalEntries
      },
      sampleEntries: {
        gift: data.gifts[0] || null,
        legendary: data.legendaries[0] || null
      }
    };

    const summaryFile = path.join(this.outputDir, 'parsing_summary.json');
    await fs.writeFile(summaryFile, JSON.stringify(summary, null, 2));
    console.log(`📋 Summary saved to: ${summaryFile}`);
  }
}

/**
 * Main execution function
 */
async function main() {
  const inputPath = process.argv[2] || './data/emerald_imperium_giftmons.xlsx';

  if (!inputPath.endsWith('.xlsx')) {
    console.log('🎮 Pokemon ROM Data Parser');
    console.log('==========================\n');
    console.log('Usage:');
    console.log('  npm run parse-pokemon <path-to-excel-file>');
    console.log('  node pokemon-parser.js <path-to-excel-file>\n');
    console.log('Examples:');
    console.log('  npm run parse-pokemon ./emerald_imperium_giftmons.xlsx');
    console.log('  node pokemon-parser.js ~/Downloads/pokemon_data.xlsx');
    return;
  }

  try {
    const parser = new PokemonDataParser(inputPath, './data/pokemon-data');
    await parser.parse();
  } catch (error) {
    console.error('💥 Parsing failed:', error);
    process.exit(1);
  }
}

// Execute if this file is run directly
if (process.argv[1] && process.argv[1].includes('pokemon-parser')) {
  main();
}

export { PokemonDataParser, type PokemonEntry, type ParsedData };
