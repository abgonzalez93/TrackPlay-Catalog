import type { Game, GameFilters } from '@trackplay/catalog-domain'
import { type Id } from '@trackplay/core'
import { type CachedEntity } from '#types/cache.type'

export interface GameProviderPort {
  getGames(filters: GameFilters): Promise<Game[]>
  getGameById(id: Id): Promise<Game | null>
}

export interface GameRepositoryPort {
  save(game: Game): Promise<void>
  saveMany(games: Game[]): Promise<void>
  findById(id: Id): Promise<CachedEntity<Game> | null>
}
