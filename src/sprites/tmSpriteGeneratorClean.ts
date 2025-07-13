// TM Sprite Generator using ImageMagick
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import { 
  parseJascPalette, 
  applyPaletteWithImageMagick 
} from './spriteUtils.js';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Type mapping for Pokemon move types to numeric IDs
const TYPE_MAP: Record<number, string> = {
  1: 'normal',     // Tackle
  2: 'fighting',   // Fighting moves  
  3: 'flying',     // Flying moves
  4: 'poison',     // Poison moves
  5: 'ground',     // Ground moves
  6: 'rock',       // Rock moves
  7: 'bug',        // Bug moves
  8: 'ghost',      // Ghost moves
  9: 'steel',      // Steel moves
  10: 'unknown',   // Need to check
  11: 'fire',      // Flamethrower
  12: 'water',     // Surf
  13: 'grass',     // Grass moves
  14: 'electric',  // Thunderbolt
  15: 'psychic',   // Psychic moves
  16: 'ice',       // Ice moves
  17: 'dragon',    // Dragon Claw
  18: 'dark',      // Dark moves
  19: 'fairy'      // Fairy moves
};

interface Item {
  id: string;
  name: string;
  price?: number;
  description?: string;
  importance?: string;
}

interface Move {
  id: number;
  name: string;
  type: number;
  description: string;
  power: number;
  acc: number;
  cat: number;
  properties?: string[];
}

interface TMInfo {
  item: Item;
  move: Move;
  moveType: string;
  paletteFile: string;
}

export class TMSpriteGenerator {
  private deezData: Item[] = [];
  private moveData: Move[] = [];
  private upscaledPath = './upscaled/items';
  private paletteSourcePath = './upscaled/icon_palettes';
  private debugMode = false;
  
  constructor(debugMode = false) {
    this.debugMode = debugMode;
  }

  async loadData(): Promise<void> {
    try {
      console.log('Loading deez.json...');
      const deezContent = await readFile('./deez.json', 'utf8');
      this.deezData = JSON.parse(deezContent);
      
      console.log('Loading moveData.json...');
      const moveContent = await readFile('./moveData.json', 'utf8');
      this.moveData = JSON.parse(moveContent);
      
      console.log(`Loaded ${this.deezData.length} items and ${this.moveData.length} moves`);
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  }

  // Extract TM items from deez.json (excluding TM_CASE)
  getTMItems(): Item[] {
    return this.deezData.filter(item => 
      item.id.startsWith('ITEM_TM_') && item.id !== 'ITEM_TM_CASE'
    );
  }

  // Find the corresponding move for a TM item
  findMoveForTM(tmItem: Item): Move | null {
    // Remove "ITEM_TM_" prefix and convert to lowercase
    const moveName = tmItem.id.replace('ITEM_TM_', '').toLowerCase();
    
    // Find the move by comparing lowercase names
    const move = this.moveData.find(move => 
      move.name.toLowerCase().replace(/[^a-z0-9]/g, '') === moveName.replace(/[^a-z0-9]/g, '')
    );
    
    return move || null;
  }

  // Get the type name for a move type ID
  getTypeName(typeId: number): string {
    return TYPE_MAP[typeId] || 'normal';
  }

  // Get the palette file path for a move type
  getPaletteFile(typeName: string): string {
    return `${typeName}_tm_hm.pal`;
  }

  // Process all TM items and gather their information
  async processTMItems(): Promise<TMInfo[]> {
    const tmItems = this.getTMItems();
    const tmInfos: TMInfo[] = [];
    
    console.log(`Found ${tmItems.length} TM items`);
    
    for (const tmItem of tmItems) {
      const move = this.findMoveForTM(tmItem);
      
      if (!move) {
        console.warn(`No move found for TM: ${tmItem.id} (${tmItem.name})`);
        continue;
      }
      
      const moveType = this.getTypeName(move.type);
      const paletteFile = this.getPaletteFile(moveType);
      
      tmInfos.push({
        item: tmItem,
        move,
        moveType,
        paletteFile
      });
    }
    
    return tmInfos;
  }

  // Check which TM sprites are missing
  async findMissingTMSprites(): Promise<TMInfo[]> {
    const allTMs = await this.processTMItems();
    const missingTMs: TMInfo[] = [];
    
    for (const tmInfo of allTMs) {
      // Convert item ID to expected sprite name
      let spriteName = tmInfo.item.id.replace('ITEM_', '').toLowerCase();
      let spriteFile = `${spriteName}.png`;
      let spritePath = path.join(this.upscaledPath, spriteFile);
      
      if (!existsSync(spritePath)) {
        missingTMs.push(tmInfo);
      }
    }
    
    console.log(`Found ${missingTMs.length} missing TM sprites out of ${allTMs.length} total TMs`);
    return missingTMs;
  }

  // Generate actual TM sprites using ImageMagick
  async generateTMSprites(): Promise<void> {
    const missingTMs = await this.findMissingTMSprites();
    
    // Load the base TM sprite
    const baseTMPath = path.join(this.upscaledPath, 'tm.png');
    if (!existsSync(baseTMPath)) {
      throw new Error(`Base TM sprite not found: ${baseTMPath}`);
    }
    
    console.log(`Loading base TM sprite from: ${baseTMPath}`);
    console.log(`Generating ${missingTMs.length} TM sprites...`);
    
    let generated = 0;
    let skipped = 0;
    
    for (const tmInfo of missingTMs) {
      try {
        // Get the palette file path
        const paletteFilePath = path.join(this.paletteSourcePath, tmInfo.paletteFile);
        
        if (!existsSync(paletteFilePath)) {
          console.warn(`Palette file not found: ${paletteFilePath}, skipping ${tmInfo.item.id}`);
          skipped++;
          continue;
        }
        
        // Parse the palette using shared utility
        const palette = await parseJascPalette(paletteFilePath);
        console.log(`Loaded palette for ${tmInfo.moveType} with ${palette.colors.length} colors`);
        
        // Generate output filename
        const outputFileName = `${tmInfo.item.id.replace('ITEM_', '').toLowerCase()}.png`;
        const outputPath = path.join(this.upscaledPath, outputFileName);
        
        // Apply the palette using shared utility
        await applyPaletteWithImageMagick(baseTMPath, palette, outputPath, this.debugMode);
        
        console.log(`Generated: ${outputFileName} (${tmInfo.moveType} type)`);
        generated++;
        
        // Add a small delay to avoid overwhelming the system
        if (generated % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } catch (error) {
        console.error(`Error generating sprite for ${tmInfo.item.id}:`, error);
        skipped++;
      }
    }
    
    console.log(`\\nGeneration complete:`);
    console.log(`- Generated: ${generated} sprites`);
    console.log(`- Skipped: ${skipped} sprites`);
  }

  // Generate a summary report of all TM mappings
  async generateReport(): Promise<void> {
    const tmInfos = await this.processTMItems();
    
    const reportPath = path.join(__dirname, '..', '..', 'tm_mapping_report_imagemagick.json');
    const report = {
      generatedAt: new Date().toISOString(),
      totalTMs: tmInfos.length,
      mappings: tmInfos.map(tm => ({
        itemId: tm.item.id,
        itemName: tm.item.name,
        moveId: tm.move.id,
        moveName: tm.move.name,
        moveType: tm.moveType,
        paletteFile: tm.paletteFile
      })),
      typeDistribution: this.getTypeDistribution(tmInfos)
    };
    
    await writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`Report generated: ${reportPath}`);
  }

  private getTypeDistribution(tmInfos: TMInfo[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    for (const tm of tmInfos) {
      distribution[tm.moveType] = (distribution[tm.moveType] || 0) + 1;
    }
    
    return distribution;
  }

  // Create a visual test montage to compare results
  async createTestMontage(outputPath: string): Promise<void> {
    try {
      console.log('Creating test montage for visual comparison...');
      
      const tmInfos = await this.processTMItems();
      // Take first 12 TMs for the montage (3x4 grid)
      const testTMs = tmInfos.slice(0, 12);
      const tempImages: string[] = [];
      const baseTMPath = path.join(this.upscaledPath, 'tm.png');
      
      for (let i = 0; i < testTMs.length; i++) {
        const tmInfo = testTMs[i];
        const paletteFilePath = path.join(this.paletteSourcePath, tmInfo.paletteFile);
        
        if (!existsSync(paletteFilePath)) continue;
        
        const palette = await parseJascPalette(paletteFilePath);
        const tempOutputPath = `/tmp/test_tm_${i}_${tmInfo.moveType}.png`;
        
        await applyPaletteWithImageMagick(baseTMPath, palette, tempOutputPath, this.debugMode);
        tempImages.push(tempOutputPath);
      }
      
      if (tempImages.length > 0) {
        // Create a montage with labels
        const montageCommand = `magick montage ${tempImages.join(' ')} -tile 4x3 -geometry +2+2 -background white "${outputPath}"`;
        await execAsync(montageCommand);
        
        console.log(`Test montage created: ${outputPath}`);
        
        // Clean up temporary images
        for (const tempImg of tempImages) {
          try {
            await execAsync(`rm -f "${tempImg}"`);
          } catch {}
        }
      }
      
    } catch (error) {
      console.error('Error creating test montage:', error);
    }
  }

  // Main execution method
  async run(): Promise<void> {
    try {
      await this.loadData();
      const tmInfos = await this.processTMItems();
      
      // Log some examples
      console.log('\\nFirst 5 TM mappings:');
      for (const tmInfo of tmInfos.slice(0, 5)) {
        console.log(`${tmInfo.item.id} -> ${tmInfo.move.name} (${tmInfo.moveType}) -> ${tmInfo.paletteFile}`);
      }
      
      // Generate the report
      await this.generateReport();
      
      // Create test montage if in debug mode
      if (this.debugMode) {
        const montageOutputPath = path.join(__dirname, '..', '..', 'tm_test_montage.png');
        await this.createTestMontage(montageOutputPath);
      }
      
      // Generate actual sprites
      await this.generateTMSprites();
      
    } catch (error) {
      console.error('Error in TMSpriteGenerator:', error);
      throw error;
    }
  }
}

// CLI execution
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  const debugMode = process.argv.includes('--debug');
  const generator = new TMSpriteGenerator(debugMode);
  
  if (debugMode) {
    console.log('Running in debug mode - will save intermediate files and create test montage');
  }
  
  generator.run().catch(console.error);
}
