import { Game, GameFilters, GameList, Id } from '@trackplay/core/schemas'
import { getTranslationPath } from '@trackplay/core/utils'
import { NotFoundError } from '@trackplay/core/errors'
import { GameUseCase } from './gameUseCase.interface'
import { GameService } from '@services/index'

const path = getTranslationPath(import.meta.url)

/**
 * Game Use Case
 *
 * Encapsulates the application-level business rules for game operations.
 * This layer orchestrates domain-neutral interactions with the {@link GameService}.
 *
 * Responsibilities:
 * - Defines **what** the application can do with games (search, retrieve).
 * - Delegates execution to the {@link GameService}.
 * - Handles error cases (e.g., when a game is not found).
 *
 */
export const gameUseCase = (gameService: GameService): GameUseCase => {
  /**
   * Searches for games based on the provided filters.
   * Delegates execution to the {@link GameService}.
   */
  const searchGames = async (filters: GameFilters): Promise<GameList> => await gameService.searchGames(filters)

  /**
   * Retrieves a game by its unique identifier.
   * Throws a {@link NotFoundError} if the game is not found.
   */
  const getGameById = async (id: Id): Promise<Game> => {
    const game = await gameService.getGameById(id)
    if (!game) throw new NotFoundError(`${path}.game_not_found`)
    return game
  }

  return {
    searchGames,
    getGameById,
  }
}
