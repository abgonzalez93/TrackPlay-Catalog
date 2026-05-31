import type { GameMode, GameModeFilters } from '@trackplay/catalog-domain'
import { type Logger } from '@trackplay/core'
import type { GameModeProviderPort, GameModeRepositoryPort } from '#ports/gameMode.port'

export interface GameModeUseCase {
  getGameModes(filters: GameModeFilters): Promise<GameMode[]>
}

export const gameModeUseCase = (
  provider: GameModeProviderPort,
  repository: GameModeRepositoryPort,
  logger: Logger,
): GameModeUseCase => {
  const getGameModes = async (filters: GameModeFilters): Promise<GameMode[]> => {
    const gameModes = await provider.getGameModes(filters)

    if (gameModes.length > 0) {
      void repository.saveMany(gameModes).catch((error) => {
        logger.error('Failed to save game modes batch', { count: gameModes.length, error })
      })
    }

    return gameModes
  }

  return { getGameModes }
}
