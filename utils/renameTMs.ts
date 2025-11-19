import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Item {
    id: number;
    constantName: string;
    name: string;
    price: number;
    description: string;
    iconPic: string;
    iconPalette: string;
}

/**
 * Transforms a TM constant name to a readable scroll name
 * Example: ITEM_TM_X_SCISSOR -> X Scissor Scroll
 */
function transformTMName(constantName: string): string {
    // Remove the "ITEM_TM_" prefix
    const withoutPrefix = constantName.replace(/^ITEM_TM_/, '');
    
    // Split by underscores and capitalize each word
    const words = withoutPrefix
        .split('_')
        .map(word => {
            // Capitalize first letter, lowercase rest
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
    
    // Add "Scroll" suffix
    return `${words} Scroll`;
}

/**
 * Reads items.json, updates TM names, and writes back to the file
 */
function renameTMs() {
    const itemsPath = path.join(__dirname, '..', 'gameData', 'items.json');
    
    // Read the items file
    const itemsData = fs.readFileSync(itemsPath, 'utf-8');
    const items: Item[] = JSON.parse(itemsData);
    
    let updatedCount = 0;
    
    // Process each item
    items.forEach(item => {
        // Check if the name matches the TMxx pattern
        const tmPattern = /^TM\d+$/;
        if (tmPattern.test(item.name)) {
            // Transform the constant name
            const newName = transformTMName(item.constantName);
            console.log(`Updating: ${item.name} (${item.constantName}) -> ${newName}`);
            item.name = newName;
            updatedCount++;
        }
    });
    
    // Write back to file with pretty formatting
    fs.writeFileSync(itemsPath, JSON.stringify(items, null, 4), 'utf-8');
    
    console.log(`\n✓ Updated ${updatedCount} TM items`);
}

// Run the script
renameTMs();
