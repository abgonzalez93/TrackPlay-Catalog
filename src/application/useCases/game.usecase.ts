import type { Game, GameFilters } from '@trackplay/catalog-domain'
import { type Id, type Logger, NotFoundError } from '@trackplay/core'
import { isStale, revalidateInBackground } from './helpers/cache.helper.ts'
import type { GameProviderPort, GameRepositoryPort } from '#ports/game.port'

export interface GameUseCase {
  getGames(filters: GameFilters): Promise<Game[]>
  getGameById(id: Id): Promise<Game>
}

export const gameUseCase = (provider: GameProviderPort, repository: GameRepositoryPort, logger: Logger): GameUseCase => {
  const getGames = async (filters: GameFilters): Promise<Game[]> => {
    const games = await provider.getGames(filters)

    if (games.length > 0) {
      void repository.saveMany(games).catch((error) => {
        logger.error('Failed to save games batch', { count: games.length, error })
      })
    }

    return games
  }

  const getGameById = async (id: Id): Promise<Game> => {
    const cached = await repository.findById(id)

    if (cached) {
      if (isStale(cached.lastSyncAt)) {
        revalidateInBackground({
          id,
          fetch: provider.getGameById,
          save: repository.save,
          logger,
          entityName: 'game',
        })
      }
      return cached.data
    }

    const externalGame = await provider.getGameById(id)

    if (externalGame) {
      void repository.save(externalGame).catch((error) => {
        logger.error('Failed to save game', { id, error })
      })

      return externalGame
    }

    throw new NotFoundError({ i18nKey: 'catalog.games.not_found' })
  }

  return {
    getGames,
    getGameById,
  }
}
