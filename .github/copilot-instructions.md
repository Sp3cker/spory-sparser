# Spoly-Sparser: Pokémon ROM Hacking Data Parser

## Project Overview
This TypeScript project parses Pokémon ROM decompilation files (primarily `.inc` scripts) to extract item locations, gift Pokémon, and trainer data. It's designed for rom-hacking workflows and produces structured JSON data about obtainable items, Pokémon, and trainer encounters.

## Architecture & Core Components

### Main Entry Point
- **`src/main.ts`**: Orchestrates the entire parsing pipeline, merging data from multiple sources
- **`src/configReader.ts`**: Loads configuration from `sparser.toml` for directory paths

### Core Parsing System
- **`src/parseMaps/`**: Heart of the parsing logic
  - **`incParser.ts`**: Parses `.inc` script files for `giveitem`, `givemon`, and `dynmultipush` commands
  - **`index.ts`**: Processes map directories, extracting level data from `scripts.inc` files
  - **`Trainers/`**: Extracts trainer battle data and party information
- **`src/parseMarts.ts`**: Parses shop/mart data from `.inc` files
- **`src/parseMapEvents.ts`**: Handles map event parsing and item ball scripts

### Data Structure
The parsing system handles two types of .inc files:

**Map-based .inc files** (current standard):
- **Map**: Base location (e.g., "AquaHideout")  
- **Level**: Specific sub-location (e.g., "AquaHideout_1F")
- **Script Events**: Individual item/Pokémon giving scripts within levels
- Level determined by folder structure: `maps/AquaHideout_1F/scripts.inc`

**Non-map .inc files** (upcoming):
- Level determined by ScriptName within the .inc file
- Used for scripts that don't belong to specific geographic locations
- Parser extracts level information from script naming patterns

## Key Workflows

### Building & Running
```bash
npm run build      # Compile TypeScript
npm run main       # Run the main parser
npm test          # Run test suite
```

### Development Scripts
```bash
npm run testinc maps/Route104/scripts.inc  # Test single .inc file
npm run sprites    # Generate item sprites
npm run trainers   # Process trainer data
```

### Configuration
Edit `sparser.toml` to set directory paths:
```toml
[directories]
maps = "/maps"
data = "/data"
output = "/generated"
```

## Project-Specific Conventions

### Script Parsing Patterns
- **`giveitem ITEM_NAME`**: Standard item gifts
- **`givemon SPECIES_NAME, level`**: Pokémon gifts
- **`dynmultipush`**: Complex multi-item/Pokémon scripts
- **`@explanation`**: Special comments that provide context for parsed events

### Data Validation
Uses Zod schemas in `src/validators/` for runtime type checking:
- `levelIncData.ts`: Validates parsed script events
- `trainerRecord.ts`: Validates trainer data structure
- `mapEvent.ts`: Validates map event data

### Level ID Mapping
Two approaches for determining level IDs:

**Map-based approach** (current):
- Map folder names (e.g., `AquaHideout_1F`) are converted to level IDs
- `helpers.ts` contains utilities for map name parsing and ID generation
- Special handling for route names vs. building names

**Script-based approach** (upcoming):
- For non-map .inc files, level determined from ScriptName patterns
- Parser analyzes script naming conventions to extract location context
- Enables processing of scripts not tied to specific geographic maps

## Critical Development Patterns

### Error Handling
- Parsing errors include file context and line information
- Use `try-catch` blocks around file processing with descriptive error messages
- Validation failures show specific schema violations

### Testing Strategy
- Tests focus on `.inc` file parsing correctness
- Use actual ROM script snippets as test cases
- Test both successful parsing and error conditions

### File Processing
- Always use absolute paths when working with files
- Handle missing files gracefully (some maps lack `scripts.inc`)
- Process directories recursively for nested map structures
- **Important**: Each map has exactly one `.inc` file, but not all `.inc` files belong to maps
- Support for non-map `.inc` files requires ScriptName-based level determination

## Integration Points

### Input Sources
- **`maps/*/scripts.inc`**: Primary script files from ROM decompilation (map-based)
- **Non-map `.inc` files**: Scripts not tied to specific geographic locations (upcoming)
- **`trainers.json`**: Trainer data from ROM extraction
- **`levels.json`**: Level metadata and organization

### Output Format
- **`generated/`**: Structured JSON output for web consumption
- **`build/`**: Compiled TypeScript for execution
- **`log/`**: Processing logs and debug information

## Special Considerations

### Pokémon ROM Hacking Context
- Understands ROM decompilation terminology (`trainerbattle_single`, `pokemart`, etc.)
- Handles special cases like starter Pokémon selection and rematch trainers
- Processes both original and modified ROM content

### Performance Notes
- Large map directories require efficient file processing
- JSON output can be substantial - use streaming for large datasets
- Caching mechanisms for repeated file reads

When working on this project, prioritize understanding the ROM script syntax and the hierarchical relationship between maps, levels, and events. The parsing logic is the core value - everything else supports getting accurate data extraction from ROM decompilation files.
