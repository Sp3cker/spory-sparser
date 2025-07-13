// Generated Pokemon ROM data types
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
