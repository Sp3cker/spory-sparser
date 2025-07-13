# Config Reader

This module provides a robust configuration reader for the `sparser.toml` file with validation using Zod schemas and directory existence validation.

## Features

- **Type-safe configuration**: Uses Zod for runtime validation and TypeScript for compile-time safety
- **Directory validation**: Automatically validates that all configured directories exist on the filesystem
- **Error handling**: Provides detailed error messages for validation failures, file reading errors, and missing directories
- **Flexible usage**: Can load from different config file paths
- **Absolute path resolution**: Converts relative paths to absolute paths based on the current working directory

## Usage

### Basic Usage

```typescript
import { Config } from './configReader.js';

// Load configuration from default sparser.toml file
// This will validate both the config structure AND directory existence
const config = Config.load();

// Access configuration properties (all as absolute paths)
console.log(config.data);        // "/absolute/path/to/data"
console.log(config.battlePics);  // "/absolute/path/to/generated/trainers"
console.log(config.sprites);     // "/absolute/path/to/generated/trainers/48"
console.log(config.mapsDir);     // "/absolute/path/to/maps"
```

### Load from Custom Path

```typescript
// Load from a custom configuration file
const config = Config.load('./custom-config.toml');
```

### Using Constructor Directly

```typescript
// Alternative way to create a Config instance
const config = new Config('sparser.toml');
```

### Get All Directories

```typescript
const directories = config.getDirectories();
// Returns: { data: "/data", battlePics: "/generated/trainers", sprites: "/generated/trainers/48" }
```

### Get Absolute Paths

```typescript
const absoluteDataPath = config.getAbsolutePath('data');
// Returns absolute path to the data directory
```

## Configuration Schema

The configuration file must follow this structure:

```toml
[directories]
data = "/data"
battlePics = "/generated/trainers"
sprites = "/generated/trainers/48"
maps = "/maps"
```

### Validation Rules

- All directory paths must be non-empty strings
- The `directories` section is required
- All four directory properties (`data`, `battlePics`, `sprites`, `maps`) are required
- **All directories must exist on the filesystem** - the Config class will validate existence during initialization

## Error Handling

The Config class will throw descriptive errors for:

- **File not found**: When the configuration file doesn't exist
- **Invalid TOML**: When the file contains invalid TOML syntax
- **Schema validation failures**: When the configuration doesn't match the expected structure
- **Missing required properties**: When required configuration values are missing
- **Missing directories**: When any of the configured directories don't exist on the filesystem

### Example Error Messages

```
Configuration validation failed: directories.data: Data directory path cannot be empty

Failed to read or parse configuration file: ENOENT: no such file or directory, open 'sparser.toml'

The following configured directories do not exist:
  - data: /absolute/path/to/data
  - maps: /absolute/path/to/maps
```

## Type Safety

The module exports a `ConfigType` type that represents the validated configuration structure:

```typescript
import { ConfigType } from './configReader.js';

// ConfigType is inferred from the Zod schema
const processConfig = (config: ConfigType) => {
  // TypeScript knows the exact structure
  console.log(config.directories.data);
};
```
