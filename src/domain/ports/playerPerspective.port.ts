import type { PlayerPerspective, PlayerPerspectiveFilters } from '@trackplay/catalog-domain'

export interface PlayerPerspectiveProviderPort {
  getPlayerPerspectives(filters: PlayerPerspectiveFilters): Promise<PlayerPerspective[]>
}

export interface PlayerPerspectiveRepositoryPort {
  saveMany(playerPerspectives: PlayerPerspective[]): Promise<void>
}
