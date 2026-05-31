import type { PlayerPerspective, PlayerPerspectiveFilters } from '@trackplay/catalog-domain'
import { type Logger } from '@trackplay/core'
import type { PlayerPerspectiveProviderPort, PlayerPerspectiveRepositoryPort } from '#ports/playerPerspective.port'

export interface PlayerPerspectiveUseCase {
  getPlayerPerspectives(filters: PlayerPerspectiveFilters): Promise<PlayerPerspective[]>
}

export const playerPerspectiveUseCase = (
  provider: PlayerPerspectiveProviderPort,
  repository: PlayerPerspectiveRepositoryPort,
  logger: Logger,
): PlayerPerspectiveUseCase => {
  const getPlayerPerspectives = async (filters: PlayerPerspectiveFilters): Promise<PlayerPerspective[]> => {
    const playerPerspectives = await provider.getPlayerPerspectives(filters)

    if (playerPerspectives.length > 0) {
      void repository.saveMany(playerPerspectives).catch((error) => {
        logger.error('Failed to save player perspectives batch', { count: playerPerspectives.length, error })
      })
    }

    return playerPerspectives
  }

  return { getPlayerPerspectives }
}
