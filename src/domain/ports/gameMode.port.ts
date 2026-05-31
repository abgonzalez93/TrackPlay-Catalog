import type { GameMode, GameModeFilters } from '@trackplay/catalog-domain'

export interface GameModeProviderPort {
  getGameModes(filters: GameModeFilters): Promise<GameMode[]>
}

export interface GameModeRepositoryPort {
  saveMany(gameModes: GameMode[]): Promise<void>
}
